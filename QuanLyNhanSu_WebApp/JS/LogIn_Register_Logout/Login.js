function List() { }
List.prototype = {
    Id: '',
    init: function () { 
        this.init_event();
        this.init_action();
    }, 
    init_event: function () {
        const me = this;
        $('.toast .close').click(function () {
            $('.toast').animate({ opacity: 0, height: 'toggle' }, 400);
        }); 
        $('#forgotpassword').click(function () {
            me.showToast('Vui lòng liên hệ với Admin để lấy lại mật khẩu! Hotline: +84 348114566', 'warning');
        }); 
        $('#showpassword').on('change', function () {
            const type = $(this).is(':checked') ? 'text' : 'password';
            $('#Password, #rePassword').attr('type', type);
        });
    },

    init_action: function () {
        const me = this;
        $('#btnLogin').click(function (e) {
            e.preventDefault();

            let isValid = true;
            $('input[required]').each(function () {
                if ($(this).val() === '') {
                    $(this).css('background-color', '#E6B800');
                    $(this).css('color', 'white');
                    $(this).attr('placeholder', $(this).attr('placeholder')).css('color', 'black');
                    isValid = false;
                } else {
                    $(this).css('background-color', '');
                    $(this).css('color', '');
                    $(this).attr('placeholder', $(this).attr('placeholder')).css('color', '');
                }
            });

            if (!isValid) {
                me.showToast('Vui lòng nhập đủ thông tin!', 'warning');
                return false;
            }

            const gmailInput = $('#Gmail');
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!gmailRegex.test(gmailInput.val())) {
                me.showToast('Địa chỉ Email không hợp lệ!', 'warning');
                return false;
            }

            const password = $("#Password").val();
            const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).{7,}$/;
            if (!passwordRegex.test(password)) {
                me.showToast('Mật khẩu phải có ít nhất 7 ký tự, bao gồm 1 chữ in hoa và 1 ký tự đặc biệt!', 'warning');
                return false;
            }
             
            me.login(); 
        });
    },
    login: function () {
        const me = this;
        const account = { 
            Password: $('#Password').val(), 
            Gmail: $('#Gmail').val() 
        };
        $.ajax({
            url: '/Login/CheckLogin',
            type: 'POST',
            data: account,
            success: function (response) {
                if (response.Success) {
                    me.showToast('Đăng nhập thành công!', 'success');
                    setTimeout(function () {
                        $('.main-agileinfo').animate({
                            width: 'toggle',
                            height: 'toggle',
                            opacity: 0
                        }, 1000, function () {
                            window.location.href = '/Dashboard/DashboardView';
                        });
                    }, 2000);

                } else {
                    me.showToast('Lỗi: ' + response.Message, 'danger');
                }
            },
            error: function (error) {
                me.showToast('Đã xảy ra lỗi: ' + error.responseText, 'danger');
            }
        });
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
    },

};