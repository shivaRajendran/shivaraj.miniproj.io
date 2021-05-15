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
var lastEntry = 'All';
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
});
$(document).on('keypress',function(e) {
    var duplicateFlag = false;
    if(e.which == 13) {
        var data = $('input').val();
        if (data === ""){
            alert('Please give some value inorder to create a todo item!');
        }else{
            for (var i = 0; i < master.length; i++){
                if(master[i].name === data){
                    duplicateFlag = true;
                    alert('The item that you have entered is already in the list');
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
                $('input').val('');
            }
            triggerClick();
            pendingData(lastEntry);
            checkForEmpty();
        }
    }
});
$('.todo-element').click(function(e){
    var c =e;
    alert('clicked');
})
$('.clear').click(function(){
    refresh();
    clearCompleted();
});
$('.todo').on('click', '.create-todo',function(){
    $('#search input').focus();
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
});
function loadData(todo, state){
    if (state === 'Active'){
        $('.todo-items').append('<div class="todo-element"><div class="checkbox-wrapper"><div class="checkbox"><img src="images/tick.png" alt=""></div></div><div class="todo-desc">'+todo+'</div></div>');
    }
    else if (state === 'Completed'){
        $('.todo-items').append('<div class="todo-element todo-done"><div class="checkbox-wrapper"><div class="checkbox"><img src="images/tick.png" alt=""></div></div><div class="todo-desc">'+todo+'</div></div>');
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
            pending = master.length + ' item(s).';
            break;
        case 'Active':
            var active = master.filter((item) => item.status === 'Active');
            pending = active.length + ' item(s).';
            break;
        case 'Completed':
            var completed = master.filter((item) => item.status === 'Completed');
            pending = completed.length + ' item(s).';
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