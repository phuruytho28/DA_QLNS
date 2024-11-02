function CoreJs() { }

CoreJs.prototype = { 
    init: function () {
        this.init_event();
        this.init_action();
    },
     
    init_event: function () {
        console.log("init_event called");
    }, 
    init_action: function () {
        console.log("init_action called");
    }, 
    showToast: function (message, type) { 
        $('.toast').toast('dispose');
         
        $('.toast-body').text(message);
         
        $('.toast').removeClass('bg-success bg-danger bg-warning').addClass('bg-' + type);
         
        if (type === 'success') {
            $('.toast').addClass('bg-lightgreen');
        }
         
        $('.toast').toast({
            delay: 3000
        });
         
        $('.toast').toast('show');
    }
}
 
var Core = new CoreJs();
