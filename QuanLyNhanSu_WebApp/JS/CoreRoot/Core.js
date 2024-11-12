function CoreJs() {} 
CoreJs.prototype = {
    isValid: true,
    companyId: '',
    roleId: 0,
    userId: '',
    userName: '',
    tknhansuId: '',
    tkphongbanId: '',
    tkcosoId: '',
    tkC3: '',
    tkchucvuId: '',
    sessionVariables: {},
    /*Trạng thái bản ghi*/
    StatusCode: Object.freeze({
        Actived: 1, 
        Deleted: 2,
    }),
    /*Tình trạng hoạt động*/
    TinhTrang: Object.freeze({
        Initialize: 1, //khởi tạo
        Actived: 2, //hoạt động
        Stop: 3,
    }),
    init: function () {  
        var arr_thamsohethong = PrammaterCommon();
        var me = this;
        me.companyId = arr_thamsohethong[0];
        me.roleId = arr_thamsohethong[1];
        me.userId = arr_thamsohethong[2];
        me.userName = arr_thamsohethong[3];
        me.tknhansuId = arr_thamsohethong[4];
        me.tkphongbanId = arr_thamsohethong[5];
        me.tkcosoId = arr_thamsohethong[6];
        me.tkC3 = arr_thamsohethong[7];
        me.tkchucvuId = arr_thamsohethong[8];
        me.init_event();
        me.init_action();
    },
    init_event: function () {},
    init_action: function () {
        console.log("init_action called"); 
        $(document).ready(function () {
            $('.pickerDate').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                todayHighlight: true,
                orientation: "bottom auto"
            });
            if ($.fn.select2) {
                $('.select2').each(function () {
                    var $this = $(this);
                    var options = {
                        theme: 'bootstrap-5',
                        width: '100%',
                        allowClear: false,  // Disable clear icon
                        language: {
                            noResults: function () {
                                return "Không tìm thấy kết quả";
                            },
                            searching: function () {
                                return "Đang tìm...";
                            }
                        }
                    };

                    if ($this.data('no-search') !== undefined) {
                        options.minimumResultsForSearch = Infinity;
                    }

                    options.placeholder = $this.data('placeholder') || 'Chọn một giá trị';

                    if ($this.prop('multiple')) {
                        options.closeOnSelect = false;
                    }

                    if ($this.data('items-limit')) {
                        options.maximumSelectionLength = $this.data('items-limit');
                    }

                    $this.select2(options);
                });

                $('.modal').on('shown.bs.modal', function () {
                    $(this).find('.select2').each(function () {
                        var $select = $(this);
                        var options = {
                            theme: 'bootstrap-5',
                            width: '100%',
                            dropdownParent: $(this).closest('.modal'),
                            allowClear: false,   
                            language: {
                                noResults: function () {
                                    return "Không tìm thấy kết quả";
                                },
                                searching: function () {
                                    return "Đang tìm...";
                                }
                            }
                        };

                        if ($select.data('no-search') !== undefined) {
                            options.minimumResultsForSearch = Infinity;
                        }

                        options.placeholder = $select.data('placeholder') || 'Chọn một giá trị';

                        if ($select.prop('multiple')) {
                            options.closeOnSelect = false;
                        }

                        if ($select.data('items-limit')) {
                            options.maximumSelectionLength = $select.data('items-limit');
                        }

                        $select.select2(options);
                    });
                });
            }

        });
    },

    //action
    showModal_Confirm: function (title, bodyContent) {
        $('#modalconfirm .modal-title').text(title);

        // Check if the body content is plain text (no HTML tags)
        if ($.trim(bodyContent).charAt(0) !== '<') { 
            bodyContent = '<p>' + bodyContent + '</p>';
        }
         
        $('#modalconfirm .modal-body').html(bodyContent);

        $('#modalconfirm .modal-content').css('border', `2px solid #198754`);

        $('#modalconfirm').modal('show');
    },

    showToast: function (message, type) {
        $('.toast').toast('dispose');
        $('.toast-body').text(message);
         
        $('.toast').removeClass('toast-success toast-danger toast-warning toast-info');
         
        $('.toast').addClass('toast-' + type);

        $('.toast').toast({
            delay: 4000,
            autohide: true
        });

        $('.toast').toast('show');
         
        var $progressBar = $('.toast-progress .progress-bar');
        $progressBar.css('width', '100%');

        var startTime = new Date().getTime();
        var interval = 10; // Update every 10ms for smooth animation
        var duration = 4000;  

        var timer = setInterval(function () {
            var time = new Date().getTime() - startTime;
            var percentage = 100 - (time / duration * 100);

            if (percentage <= 0) {
                clearInterval(timer);
                $('.toast').toast('hide');
            } else {
                $progressBar.css('width', percentage + '%');
            }
        }, interval);
         
        $('.toast .btn-close').on('click', function () {
            clearInterval(timer);
        });
    },

    validateRequiredFields: function (inputSelector) {
        let chkValid = true;
        $(inputSelector).each(function () { 
            if ($(this).is('select')) {
                if ($(this).val() === '' || $(this).val() === null) { 
                    $(this).next('.select2-container').find('.select2-selection').css({
                        'background-color': 'rgb(255 210 31)',
                        'color': 'white'
                    });
                    chkValid = false;
                } else {
                    $(this).next('.select2-container').find('.select2-selection').css({
                        'background-color': '',
                        'color': ''
                    });
                }
            } else { 
                if ($(this).val() === '') {
                    $(this).css({
                        'background-color': 'rgb(255 210 31)',
                        'color': 'white'
                    });
                    $(this).attr('placeholder', $(this).attr('placeholder')).css('color', 'black');
                    chkValid = false;
                } else {
                    $(this).css({
                        'background-color': '',
                        'color': ''
                    });
                    $(this).attr('placeholder', $(this).attr('placeholder')).css('color', '');
                }
            }
        });
        return chkValid;
    }, 

    startButtonLoading: function (buttonId) {
        var $button = $('#' + buttonId);
        if ($button.length) { 
            var originalText = $button.html();
            $button.data('original-text', originalText);
             
            $button.prop('disabled', true);
             
            $button.html(
                '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' +
                '<span>Đang xử lý...</span>'
            );
             
            $button.addClass('btn-loading');
        }
    },

    stopButtonLoading: function (buttonId) {
        var $button = $('#' + buttonId);
        if ($button.length) { 
            var originalText = $button.data('original-text');
            $button.html(originalText);
             
            $button.prop('disabled', false);
             
            $button.removeClass('btn-loading');
        }
    },


    exportValueUrl: function (paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    },

    //data
    loadDrop_Company: function (zone_id, strTitle, defaultValue) {
        var jsonData = {
            Keyword: '',
            tbl_AccountId: '',
            StatusId: -1,
            PageIndex: 1,
            PageSize: 100000
        };
        $.ajax({
            url: '/Company/CompanySearch',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');
                    if (mlen > 0) {
                        var i;
                        var getList = "";
                        if (strTitle == "" || strTitle == null || strTitle == undefined) {
                            strTitle = "-- Chọn dữ liệu --";
                        }
                        else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (i = 0; i < mlen; i++) {
                            getList += "<option name='" + json[i].MaCongTy + "' value='" + json[i].Id + "'>" + json[i].TenCongTy + "</option>";
                        }
                        tbCombo.html(getList);
                    }
                    tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    },
    loadDrop_CoSo: function (zone_id, strTitle, defaultValue) {
        var me = this; 
        var jsonData = {
            TenCoSo: '',
            tbl_CompanyId: me.roleId == 99 ? '' : me.companyId,
            StatusId: 1,
            TinhTrang: 1,
            PageIndex: 1,
            PageSize: 10000000
        };
        $.ajax({
            url: '/CoSo/FilterCoSo',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');
                    if (mlen > 0) {
                        var i;
                        var getList = "";
                        if (strTitle == "" || strTitle == null || strTitle == undefined) {
                            strTitle = "-- Chọn dữ liệu --";
                        }
                        else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (i = 0; i < mlen; i++) {
                            getList += "<option name='" + json[i].tbl_NhanSuId + "' value='" + json[i].Id + "'>" + json[i].TenCoSo + "</option>";
                        }
                        tbCombo.html(getList);
                    }
                    tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    },
    loadDrop_Category: function (zone_id, strTitle, defaultValue, loaiDM, dmCha) {
        var me = this;
        var jsonData = {
            Keyword: '',
            PhanLoaiDM: loaiDM,
            tbl_CompanyId: me.roleId == 99 ? '' : me.companyId,
            tbl_CoSoId: me.roleId == 99 ? '' : me.tkcosoId,
            tbl_PhongBanId: me.roleId == 99 ? '' : me.tkphongbanId,
            StatusId: 1,
            TinhTrang: dmCha,
            PageIndex: 1,
            PageSize: 10000000
        };
        $.ajax({
            url: '/Category/FilterPrivate_Category',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $(`#${zone_id}`);
                    tbCombo.html('');
                    if (mlen > 0) {
                        var i;
                        var getList = "";
                        if (strTitle == "" || strTitle == null || strTitle == undefined) {
                            strTitle = "-- Chọn dữ liệu --";
                        }
                        else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (i = 0; i < mlen; i++) {
                            if (me.roleId == 1 || me.roleId == 99 || json[i].RoleId != 1) {
                                getList += "<option name='" + json[i].Name + "' role='" + json[i].RoleId + "' COSO='" + json[i].tbl_CoSoId + "' PHONGBAN='" + json[i].tbl_PhongBanId + "' CHUCVU='" + json[i].tbl_Category_ChucVuId + "' value='" + json[i].Id + "'>" + json[i].MoTa + "</option>";
                            }
                        }
                        tbCombo.html(getList);
                    }
                    //tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    }, 


    loadDrop_PhongBan: function (zone_id, strTitle, defaultValue) {
        var me = this;
        var jsonData = {
            TenPhongBan: '',
            tbl_CoSoId: me.tkcosoId ? me.tkcosoId : '',
            tbl_CompanyId: me.roleId === 99 ? '' : me.companyId,
            StatusId: 1,
            TinhTrang: 1,
            PageIndex: 1,
            PageSize: 10000000
        };
        $.ajax({
            url: '/PhongBan/FilterPhongBan',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');
                    if (mlen > 0) {
                        var i;
                        var getList = "";
                        if (strTitle == "" || strTitle == null || strTitle == undefined) {
                            strTitle = "-- Chọn dữ liệu --";
                        }
                        else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (i = 0; i < mlen; i++) {
                            getList += "<option name='" + json[i].MaPhongBan + "' value='" + json[i].Id + "'>" + json[i].TenPhongBan + "</option>";
                        }
                        tbCombo.html(getList);
                    }
                    tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    }, 
    loadDrop_NhanSu: function (zone_id, strTitle, defaultValue, cosoId, phongbanId) {
        var me = this;
        var jsonData = {
            Keyword: '',
            tbl_CoSoId: me.roleId === 99 ? '' : cosoId,
            tbl_PhongBanId: me.roleId === 99 ? '' : phongbanId,
            tbl_CompanyId: me.roleId === 99 ? '' : me.companyId,
            StatusId: 1,
            TinhTrang: 2,
            RoleId: me.roleId,
            PageIndex: 1,
            PageSize: 10000000
        };
        $.ajax({
            url: '/NhanSu/FilterNhanSu',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');
                    if (mlen > 0) {
                        var getList = "";
                        if (!strTitle) {
                            strTitle = "-- Chọn dữ liệu --";
                        } else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (var i = 0; i < mlen; i++) {
                            if (json[i].RoleId > me.roleId) { // Lọc chỉ các phần tử có RoleId lớn hơn me.roleId
                                getList += "<option name='" + json[i].MaNhanVien + "' role='" + json[i].RoleId + "' value='" + json[i].Id + "'>" + json[i].HoTen + "</option>";
                            }
                        }
                        tbCombo.html(getList);
                    }
                    tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    },// đang chỉ lọc những nhân sự cấp dưới dựa vào me.roleid
    loadDrop_DiaChi: function (zone_id, LoaiDC, defaultValue) {
        var me = this; 
        var jsonData = {
            loai: LoaiDC
        };
        $.ajax({
            url: '/TinhHuyen/GetTinhHuyenById',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');

                    if (mlen > 0) {
                        var getList = "";
                        var ten, ma;
                         
                        var strTitle = "-- Chọn dữ liệu --";
                        getList += "<option value=''>" + strTitle + "</option>";

                        for (var i = 0; i < mlen; i++) {
                            if (LoaiDC === "Tinh") {
                                ten = json[i].TenTinh || "Unknown Tinh";
                                ma = json[i].MaTinh || "Unknown MaTinh";
                            } else {  
                                ten = json[i].TenHuyen || "Unknown Huyen";   
                                ma = json[i].MaHuyen || "Unknown MaHuyen";     
                            }
                             
                            getList += "<option name='" + ma + "' value='" + json[i].Id + "'>" + ten + "</option>";
                        }

                        tbCombo.html(getList);
                    }

                    tbCombo.val(defaultValue).trigger("change");
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
            }
        });
    }, 
    loadDrop_DiaChi_callback: function (zone_id, LoaiDC, defaultValue, callback) {
        var me = this;
        var jsonData = {
            loai: LoaiDC
        };
        $.ajax({
            url: '/TinhHuyen/GetTinhHuyenById',
            type: 'POST',
            data: jsonData,
            success: function (data) {
                if (data.Success) {
                    var mystring = JSON.stringify(data.Data);
                    var json = $.parseJSON(mystring);
                    var mlen = json.length;
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');
                    if (mlen > 0) {
                        var getList = "";
                        var ten, ma;

                        var strTitle = "-- Chọn dữ liệu --";
                        getList += "<option value=''>" + strTitle + "</option>";
                        for (var i = 0; i < mlen; i++) {
                            if (LoaiDC === "Tinh") {
                                ten = json[i].TenTinh || "Unknown Tinh";
                                ma = json[i].MaTinh || "Unknown MaTinh";
                            } else {
                                ten = json[i].TenHuyen || "Unknown Huyen";
                                ma = json[i].MaHuyen || "Unknown MaHuyen";
                            }

                            getList += "<option name='" + ma + "' value='" + json[i].Id + "'>" + ten + "</option>";
                        }
                        tbCombo.html(getList);
                    }
                    tbCombo.val(defaultValue).trigger("change");

                    // Gọi callback nếu có
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            },
            error: function (error) {
                console.error('AJAX request failed:', error);
                if (typeof callback === 'function') {
                    callback(error);
                }
            }
        });
    },
}