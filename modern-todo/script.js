var master = [
    {
        name: 'Wake up',
        status: 'Active'
    },
    {
        name: 'Eat food 3 times a day',
        status: 'Completed'
    },
    {
        name: 'Sleep',
        status: 'Active'
    },
    {
        name: 'Repeat',
        status: 'Active'
    }
];
master = [];
AOS.init();

// You can also pass an optional settings object
// below listed default settings
AOS.init({
  // Global settings:
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)
  

  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 500, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});
var lastEntry = 'All';
var state = "";
$('.mode-toggle').click(function(){
    $('body').toggleClass('dark-mode');
    $('.mode-toggle i').toggleClass('ri-contrast-2-line');
    $('.mode-toggle i').toggleClass('ri-sun-line');
});
$('.nav').click(function(e){
    var text = e.target.firstChild.data;
    switch (text){
        case 'All':
            lastEntry = 'All';
            handleAll();
            pendingData(text);
            break;
        case 'Active':
            lastEntry = 'Active';
            handleActive();
            pendingData(text);
            break;
        case 'Completed':
            lastEntry = 'Completed';
            handleCompleted();
            pendingData(text);
            break;
    }
});
function triggerClick(){
    switch (lastEntry){
        case 'All':
            // lastEntry = 'All';
            handleAll();
            break;
        case 'Active':
            // lastEntry = 'Active';
            handleActive();
            break;
        case 'Completed':
            // lastEntry = 'Completed';
            handleCompleted();
            break;
    }
    // $('#search input').focus();
}
function init(){
    // $('.todo-element').remove();
    for (var i = 0; i < master.length; i++){
        loadData(master[i].name, master[i].status);
    }
};
$(document).ready(function(){
    init();
    $('.todo-outer-wrapper').addClass('d-none');
    checkForEmpty();
    $('.popup').css('display', 'none');
});
$(document).on('keypress',function(e) {
    var duplicateFlag = false;
    if(e.which == 13) {
        if( $(".popup").css('display') !== 'grid') {
            var data = $('input').val();
            if (data.trim() === ""){
                triggerClick();
                refresh();
                $('#search input').focus();
                $('.popup .modal').remove();
                state = 'err';
                loadModel(state, 'Please give some value inorder to create a todo item!');
            }else{
                for (var i = 0; i < master.length; i++){
                    if(master[i].name === data){
                        duplicateFlag = true;
                        triggerClick();
                        $('.popup .modal').remove();
                        $('.popup').css('display', 'grid');
                        state = 'err';
                        loadModel(state, 'The item that you have entered is already in the list!');
                        break;
                    }
                    else{
                        duplicateFlag = false;
                    }
                }
                if (!duplicateFlag){
                    master.push({
                        name: data,
                        status: 'Active'
                    });
                    focusInput();
                }
                triggerClick();
                pendingData(lastEntry);
                checkForEmpty();
            }
            
        }
    }
    
});
function focusInput(){
    $('input').val('');
    $('#search input').focus();
}
$('.clear').click(function(){
    refresh();
    clearCompleted();
});
$('.popup').on('click', '.close-popup', function(){
    if (state === 'err'){
        focusInput();
    }
    $('.popup').css('display', 'none');
    $('.popup .modal').remove();
    triggerClick();
}); 
$('.todo').on('click', '.create-todo',function(){
    focusInput();
});
$('.todo-items').on('click', '.checkbox-wrapper', function(e){
   var selectedData = e.currentTarget.nextElementSibling.innerText;
   for (var i = 0; i < master.length; i++){
       if (master[i].name === selectedData){
           master[i].status = 'Completed'
       }
       refresh();
       init();
       triggerClick();
       pendingData(lastEntry);
       checkForEmpty();
   }
   var active = master.filter((item) => item.status === 'Active');
   if (active.length === 0){
       state = 'success';
       loadModel(state, 'Yay! you completed every todo. Enjoy the rest of your day!!')
   }
});
$('.todo-items').on('click', '.close-action', function(e){
    var selectedData = e.currentTarget.previousElementSibling.innerText;
    master = master.filter((item) => item.name !== selectedData);
    refresh();
    init();
    triggerClick();
    pendingData(lastEntry);
    checkForEmpty();
 });
 $('.todo-items').on('click', '.reopen-action', function(e){
    var selectedData = e.currentTarget.previousElementSibling.innerText;
    for (var i = 0; i < master.length; i++){
        if (master[i].name === selectedData){
            master[i].status = 'Active'
        }
        refresh();
        init();
        triggerClick();
        pendingData(lastEntry);
        checkForEmpty();
    }
    refresh();
    init();
    triggerClick();
    pendingData(lastEntry);
    checkForEmpty();
 });
function loadData(todo, state){
    if (state === 'Active'){
        $('.todo-items').append('<div class="todo-element"><div class="checkbox-wrapper" title="Mark as complete"><div class="checkbox"><img src="images/tick.png" alt=""></div></div><div class="todo-desc">'+todo+'</div><div class="todo-action close-action"> <i class="ri-close-fill" title = "Close todo"></i></div></div>');
    }
    else if (state === 'Completed'){
        $('.todo-items').append('<div class="todo-element todo-done"><div class="checkbox-wrapper" title="Mark as complete"><div class="checkbox"><img src="images/tick.png" alt=""></div></div><div class="todo-desc">'+todo+'</div><div class="todo-action reopen-action"> <i class="ri-refresh-line" title = "Re-open todo"></i></div></div>');
    }
    // triggerClick();
};
function handleAll(){
    $('.nav-tabs .nav:nth-child(1), .nav-tabs-res .nav:nth-child(1)').addClass('nav-active');
    $('.nav-tabs .nav:nth-child(2), .nav-tabs-res .nav:nth-child(2)').removeClass('nav-active');
    $('.nav-tabs .nav:nth-child(3), .nav-tabs-res .nav:nth-child(3)').removeClass('nav-active');
    refresh();
    init();
};
function handleActive(){

    $('.nav-tabs .nav:nth-child(1), .nav-tabs-res .nav:nth-child(1)').removeClass('nav-active');
    $('.nav-tabs .nav:nth-child(2), .nav-tabs-res .nav:nth-child(2)').addClass('nav-active');
    $('.nav-tabs .nav:nth-child(3), .nav-tabs-res .nav:nth-child(3)').removeClass('nav-active');
    refresh();
    for (var i = 0; i < master.length; i++){
        if(master[i].status === 'Active'){
            loadData(master[i].name, master[i].status);
        }
    }
    
};
function handleCompleted(){
    $('.nav-tabs .nav:nth-child(1), .nav-tabs-res .nav:nth-child(1)').removeClass('nav-active');
    $('.nav-tabs .nav:nth-child(2), .nav-tabs-res .nav:nth-child(2)').removeClass('nav-active');
    $('.nav-tabs .nav:nth-child(3), .nav-tabs-res .nav:nth-child(3)').addClass('nav-active');
    refresh();
    var completed = master.filter((item) => item.status === 'Completed');
    if (completed.length !== 0){
        for (var i = 0; i < master.length; i++){
            if(master[i].status === 'Completed'){
                loadData(master[i].name, master[i].status);
            }
        }
    }else{
        $('.todo-items').append('<div class="todo-message"> <i class="ri-history-line"></i> <br><p>There is nothing in your history</p></div>');
    }
    
};
function refresh(){
    $('.todo-element, .todo-message').remove();
};
function clearCompleted(){
    master = master.filter((item) => item.status !== 'Completed');
    init();
    triggerClick();
    pendingData(lastEntry);
}
function pendingData(data){
    var pending = '';
    switch (data){
        case 'All':
            pending = master.length + ' item(s) overall.';
            break;
        case 'Active':
            var active = master.filter((item) => item.status === 'Active');
            pending = active.length + ' item(s) active.';
            break;
        case 'Completed':
            var completed = master.filter((item) => item.status === 'Completed');
            pending = completed.length + ' item(s) completed.';
            break;
    }
    $('.pending').text(pending);
}
function checkForEmpty(){
    var active = master.filter((item) => item.status === 'Active');
    if (active.length === 0){
        if (!$('.todo-outer-wrapper').hasClass('d-none')){
            $('.todo-outer-wrapper').addClass('d-none');
        }
        $('.todo').append('<div class="empty-message"><div class="message-wrapper"> <i class="ri-file-add-fill"></i><p>You dont have anything on your todo and this is the perfect time to be productive.</p> <button class="create-todo"><i class="ri-add-line"></i>&nbsp;Create new todo</button></div></div>');
    }else{
        if ($('.todo-outer-wrapper').hasClass('d-none')){
            $('.todo-outer-wrapper').removeClass('d-none');
        }
        $(' body .todo .empty-message').remove();
    }
};
function loadModel(type, message){
    $('.popup').css('display', 'grid');
    if (type === 'err'){
        $('.popup').append('<div class="modal err-modal" data-aos="flip-down"><div class="icon"><i class="ri-error-warning-line"></i></div><div class="modal-desc"><h1>Error</h1><p class="details">'+message+'</p> <button class="close-popup">Close</button></div></div>');
    }else if ('success'){
        $('.popup').append('<div class="modal success-modal" data-aos="zoom-in"><div class="icon"><i class="ri-checkbox-circle-line"></i></div><div class="modal-desc"><h1>Success</h1><p class="details">'+message+'</p> <button class="close-popup">Close</button></div></div>');
    }
};