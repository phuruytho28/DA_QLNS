﻿function DetailNhanSu() { } 
DetailNhanSu.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    tkcosoId: '',
    tkphongbanId: '',
    userName: '',
    RecoverMode: false,
    jsValid: '#txtHoTen, #txtNgaySinh, #txtEmail, #txtSDT, #txtDiaChiQue,  #txtDiaChiHienTai, #txtSoCCCD,  #DropGioiTinh, #DropHocVan, #DropDanToc, #DropTonGiao, #DropQueQuan_Tinh, #DropQueQuan_Huyen, #DropHienTai_Tinh, #DropHienTai_Huyen, #DropChucVu,  #DropNoiCapCCCD_Tinh', /*, #DropCoSo,#DropPhongBan,*/
    dinhdangTien: 'txtMucLuongKyHD, txtMucTienBH',
    jsValidHD: '#txtMaHopDong, #DropLoaiHD, #txtNgayTaoHD, #txtNgayKyHD, #txtMucLuongKyHD, #txtSoCongHangThang, #txtMucTienBH',
    session: '',
    queQuanHuyenId: '',
    hienTaiHuyenId: '',
    type: '',
    TuyenDungId: '',
    TT_HoSoNS: '',
    tkC3: '',
    HDLSfalse: 0,

    StatusCode: Object.freeze({
        Actived: 1, 
        Deleted: 2,
    }),
    init: function () {
        this.init_data();
        this.init_bfLoad();
        this.init_event();
        this.init_action();
    },
    init_data: function () {
        var me = this; 
        me.Id = Core.exportValueUrl('id'); 
        me.type = Core.exportValueUrl('type'); 
        me.TuyenDungId = Core.exportValueUrl('TuyenDungId'); //check xem có phải là hồ sơ tuyển dụng không để thêm mới trạng thái tuyển dụng
        me.roleId = Core.roleId; 
        me.CongTyId = Core.companyId;   
        me.tkcosoId = Core.tkcosoId;   
        me.tkphongbanId = Core.tkphongbanId;
        me.tkC3 = Core.tkC3;
        Core.loadDrop_CoSo('DropCoSo', 'Chọn cơ sở', ''); 
        Core.loadDrop_Category('DropDanToc', 'Chọn dân tộc', '', 'DMDT', 9);
        Core.loadDrop_Category('DropHocVan', 'Chọn học vấn', '', 'DMHV', 9);
        Core.loadDrop_PhongBan('DropPhongBan', 'Chọn phòng ban', '');
        Core.loadDrop_Category('DropTonGiao', 'Chọn Tôn giáo', '', 'DMTG', 9);
        Core.loadDrop_Category('DropChucVu', 'Chọn chức vụ', '', 'DMCV', 9);
        Core.loadDrop_DiaChi('DropHienTai_Tinh', 'Tinh', '');
        //Core.loadDrop_DiaChi('DropHienTai_Huyen', '', '');
        Core.loadDrop_DiaChi('DropQueQuan_Tinh', 'Tinh', '');
        //Core.loadDrop_DiaChi('DropQueQuan_Huyen', '', '');
        Core.loadDrop_DiaChi('DropNoiCapCCCD_Tinh', 'Tinh', '');
        Core.DinhDangTien(me.dinhdangTien);
         
        if (me.Id) { 
            setTimeout(function () {
                me.getDataById(me.Id);
            }, 1050);  
        };
        if (me.TuyenDungId) { 
            setTimeout(function () {
                me.getData_ByTuyenDungId(me.TuyenDungId);
            }, 1050);  
        };
        me.disableByRoleId(); 

    },
    init_bfLoad: function () {
        var me = this;  
        if (me.tkcosoId) {
            var checkDropdown = setInterval(function () {
                if ($("#DropCoSo option").length > 0) {
                    $("#DropCoSo").val(me.tkcosoId).trigger('change');
                    clearInterval(checkDropdown);
                }
                $("#DropCoSo").prop('disabled', true);
            }, 100);
        } 
    },
    init_event: function () {
        var me = this;
        $("#btnSave_T").click(function (e) {
            e.preventDefault();
            if (me.TuyenDungId) {
                me.jsValid += ', #txtTruyCapLink';
            }
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.save();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $("#btnBack_T").click(function (e) {
            if (me.TuyenDungId) {
                if (Core.exportValueUrl('type') == 'noHSTD') {
                    window.open('/NhanSu/ListNhanSuView', '_self');
                } else {
                    window.open('/TuyenDung/DetailTuyenDungView?id=' + me.TuyenDungId, '_self');
                } 
            }
            else {
                window.open('/NhanSu/ListNhanSuView', '_self');
            }
        });
        $("#btnReset_T").click(function (e) { 
            me.reset(); 
        });
        $("#btnThemMoi_T").click(function (e) {
            window.open('/NhanSu/DetailNhanSuView', '_self');
        }); 
        $("#btnSaveHD").click(function (e) { 
            var valid = Core.validateRequiredFields(me.jsValidHD);
            if (valid == true) {
                me.saveHDLD();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $("#btnHDLD").click(function (e) {
            $("#staticBackdrop").modal('show');
            me.getDataByNhanSuId_HDLD(me.Id); 
        });
        $("#btnTruyCapLink").click(function (e) {
            var link = $('#txtTruyCapLink').val();
            if (link) {
                window.open(link, '_blank');
            } else {
                Core.showToast('Hiện chưa có đường dẫn được nhập!', 'warning');
            }
        }); 
        $('#imageUpload').on('change', function (event) {
            me.previewImage(event);
        }); 
        $('#DropCoSo').on('change', function () {
            var selectedValue = $(this).val();  
            if (selectedValue) {  
                $('#DropPhongBan').prop('disabled', false);
                if (me.type == 'HSTD' || ((me.roleId == 4) && (me.type != 'HSTD'))) {
                    $('#DropPhongBan').prop('disabled', true);
                }
            } else {
                $('#DropPhongBan').prop('disabled', true);  
            }
        });

        $('#DropQueQuan_Tinh').on('change', function () {
            var selectedOption = $(this).find('option:selected');
            var selectedValue = selectedOption.attr('name'); 
            if (selectedValue) {
                if ($("#DropQueQuan_Tinh").is(":disabled")) {  
                    $("#DropQueQuan_Huyen").prop('disabled', true);
                } else {
                    $("#DropQueQuan_Huyen").prop('disabled', false); 
                }
                Core.loadDrop_DiaChi_callback('DropQueQuan_Huyen', selectedValue, '', function () {
                    if (me.queQuanHuyenId) {
                        $("#DropQueQuan_Huyen").val(me.queQuanHuyenId).trigger('change');
                        me.queQuanHuyenId = null; // Reset sau khi đã sử dụng
                    }
                });
            }
        });

        $('#DropHienTai_Tinh').on('change', function () {
            var selectedOption = $(this).find('option:selected');
            var selectedValue = selectedOption.attr('name');
            if (selectedValue) {
                $("#DropHienTai_Huyen").prop('disabled', false);
                Core.loadDrop_DiaChi_callback('DropHienTai_Huyen', selectedValue, '', function () {
                    if (me.hienTaiHuyenId) {
                        $("#DropHienTai_Huyen").val(me.hienTaiHuyenId).trigger('change');
                        me.hienTaiHuyenId = null; // Reset sau khi đã sử dụng
                    }
                });
            }
        });

        $('#DropChucVu').on('change', function () {
            var selectedValue = $(this).val();
            var selectedName = $(this).find("option:selected").attr("name");

            if (selectedName === 'PTGD') {
                $('#zone_phongban, #z_CoSo').prop('hidden', true);
                $("#DropPhongBan").val('').trigger('change');
                $("#DropCoSo").val('').trigger('change');

            } else if (selectedName === 'GD' || selectedName === 'PGD') {
                $('#zone_phongban').prop('hidden', true);
                $('#z_CoSo').prop('hidden', false);
                $("#DropPhongBan").val('').trigger('change'); 
            } else {
                $("#DropCoSo").val(me.tkcosoId).trigger('change');
                $('#zone_phongban, #z_CoSo').prop('hidden', false);
            }
            role = $("#DropChucVu").find("option:selected").attr("name");
            
            console.log(selectedValue, selectedName, role);
        });

    },
    init_action: function () {
        var me = this;
    },  
    previewImage: function (event) {
        const imageContainer = $('#imageContainer');
        const imagePreview = $('#imagePreview');
        const file = event.target.files[0];

        if (file) {
            // Xóa ảnh cũ nếu có
            imagePreview.empty();

            // Tạo phần tử img để hiển thị ảnh mới
            const img = $('<img>').attr('src', URL.createObjectURL(file))
                .css({
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'cover',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0'
                });

            // Thêm ảnh vào khung preview
            imagePreview.append(img);
        }
    },
    /*CRUD*/ 
    save: function () {
        var me = this;
        //let MaNhanVien = $("#DropPhongBan").find("option:selected").attr("name");
        let MaNhanVien = $("#txtMaNhanVien").val();
        let HoTen = $("#txtHoTen").val();
        let NgaySinh = $("#txtNgaySinh").val();
        let Email = $("#txtEmail").val();
        let SDT = $("#txtSDT").val();
        let DiaChi_Que = $("#txtDiaChiQue").val();
        let DiaChi_HienTai = $("#txtDiaChiHienTai").val(); 
        let SoCCCD = $("#txtSoCCCD").val();
        let Note = $("#txtGhiChu").val();
         
        let GioiTinh = $("#DropGioiTinh").val();
        let HocVan = $("#DropHocVan").val();
        let DanToc = $("#DropDanToc").val();
        let TonGiao = $("#DropTonGiao").val();
        let tblCategory_Que_TinhId = $("#DropQueQuan_Tinh").val();
        let tblCategory_Que_HuyenId = $("#DropQueQuan_Huyen").val();
        let tblCategory_HienTai_TinhId = $("#DropHienTai_Tinh").val();
        let tblCategory_HienTai_HuyenId = $("#DropHienTai_Huyen").val();
        let tbl_Category_ChucVuId = $("#DropChucVu").val();
        let tbl_PhongBanId = $("#DropPhongBan").val();
        let tbl_CoSoId = $("#DropCoSo").val();
        let tblCategory_NoiCap_TinhId = $("#DropNoiCapCCCD_Tinh").val();
        let tinhTrang_HSNS =  $('#bd_TrangThaiNS').data('value'); 
        let tinhTrang;  // Declare in the outer scope
        let definePhongBan = $("#DropPhongBan").val();
        var definedrole = $("#DropChucVu").find("option:selected").attr("role");
        var role;
        let valName = $("#DropChucVu").find("option:selected").attr("name");
        switch (valName) {
            case 'PTGD':
                role = 1;
                break;
            case 'GD':
            case 'PGD':
                role = 2;
                break;
            case 'TP':
            case 'PP':
                role = 3;
                break;
            case 'NS':
            case 'NSPT':
            case 'NSTV':
                role = 4;
                break;
        }
        if (!role) {
            if (!tbl_CoSoId) { role = 1; }
            else if (!tbl_PhongBanId) { role = 2; }
            else {
                if (definedrole == 3) {
                    role = 3;
                } else { role = 4; }
            }
        }
        console.log(me.TuyenDungId, me.Id)
        if (me.Id) {
            if (me.type == 'copy') {
                if (me.roleId == 1 || me.roleId == 99 || me.roleId == 2) {
                    if ((me.roleId == 2) && ((valName == 'GD') || (valName == 'PGD'))) {
                        tinhTrang = 1;
                    } else { 
                        tinhTrang = 2;
                    }
                } else {
                    tinhTrang = 1;
                }
                
            }
            else if (me.type == 'HSTD') {
                tinhTrang = 0;
            }
            else {
                tinhTrang = tinhTrang_HSNS || 1;
            }
        }
        else if (me.TuyenDungId && me.type == 'HSTD') {
            tinhTrang = 0;
        }
        else {
            if (me.roleId == 99 || me.roleId == 1 || me.roleId == 2) {
                if ((me.roleId == 2) && ((valName == 'GD') || (valName == 'PGD'))) {
                    tinhTrang = 1;
                } else {
                    tinhTrang = 2;
                }
            } else {
                tinhTrang = 1;
            }
        } 
        var defind;
        if (me.type) {
            if (me.type == 'HSTD') {
                defind = me.Id;
            } else {
                defind = '';
            }
        } else {
            defind = me.Id;
        }
        var ma;
        if (me.type) {
            if (me.Id && (me.type == 'HSTD')) {
                ma = MaNhanVien;
            } else {
                ma = '';
            }
        } else {
            ma = MaNhanVien;
        }
        let jsonData = {
            'MaNhanVien': ma,
            'HoTen': HoTen,
            'GioiTinh': GioiTinh,
            'NgaySinh': NgaySinh,
            'tblCategory_Que_TinhId': tblCategory_Que_TinhId,
            'tblCategory_Que_HuyenId': tblCategory_Que_HuyenId,
            'DiaChi_Que': DiaChi_Que,
            'tblCategory_HienTai_TinhId': tblCategory_HienTai_TinhId,
            'tblCategory_HienTai_HuyenId': tblCategory_HienTai_HuyenId,
            'DiaChi_HienTai': DiaChi_HienTai,
            'tbl_CoSoId': tbl_CoSoId,
            'tbl_PhongBanId': tbl_PhongBanId,
            'tbl_Category_ChucVuId': tbl_Category_ChucVuId,
            'tbl_Category_DanTocId': DanToc,
            'tbl_Category_TonGiaoId': TonGiao,
            'tbl_Category_HocVanId': HocVan,
            'SoCCCD': SoCCCD,
            'tblCategory_NoiCap_TinhId': tblCategory_NoiCap_TinhId,
            'Email': Email,
            'SDT': SDT,
            'Note': Note,
            'tbl_CompanyId': me.roleId == 99 ? $('#z_Congty').val() : me.CongTyId, 
            'CreatedBy': Core.userName,
            'TinhTrang': tinhTrang,
            'StatusId': me.StatusId_Edit, 

            'RoleId': role,
            'C3': (definePhongBan === 'D0D7A8A7-9452-4470-81A6-ADDC2A9FB73C' || !definePhongBan) ? 'NHANSU' : '-1', // dùng tạm

            'Id': defind, //me.type để xác định xem id tuyển dụng có khác id nhân sự không 
        };
        if (me.TuyenDungId) {
            jsonData['TinhTrangHoSoTD'] = $('#bd_TrangThaiTD').data('value') || 1;  
            jsonData['tbl_TuyenDungId'] = me.TuyenDungId;
            jsonData['LinkHoSoUngVien'] = $('#txtTruyCapLink').val() || ''; 
        }
          
         Core.startButtonLoading("btnSave");
         
        $.ajax({
            type: 'POST',
            url: '/NhanSu/Save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    if ((!me.TuyenDungId && !me.Id) || (me.Id && (me.type == 'copy'))) {
                        me.add_account();
                    } else if (me.type != 'HSTD' && me.roleId != 4) {
                        Core.showModal_Confirm(
                            'Thông báo',
                            'Thành công! Đang chuyển hướng về trang danh sách...'
                        );
                        $('.modal-footer').hide();
                        setTimeout(function () {

                            window.open('/NhanSu/ListNhanSuView', '_self');

                        }, 2500);
                    } else if (me.type == "HSTD") {
                        Core.showModal_Confirm(
                            'Thông báo',
                            'Thành công! Đang chuyển hướng về trang danh sách...'
                        );
                        $('.modal-footer').hide();
                        setTimeout(function () {

                            window.open('/TuyenDung/DetailTuyenDungView?id=' + me.TuyenDungId, '_self');

                        }, 2500);
                    }
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {  
                Core.stopButtonLoading("btnSave"); 
            }
        });
    },
    getDataById: function (id) {
        var me = this;
        let jsonData = {
            'Id': id 
        };
        $.ajax({
            type: 'POST',
            url: '/NhanSu/GetNhanSuById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                        me.queQuanHuyenId = obj.tblCategory_Que_HuyenId;
                        me.hienTaiHuyenId = obj.tblCategory_HienTai_HuyenId;

                        $("#txtMaNhanVien").val(obj.MaNhanVien);
                        $("#txtHoTen").val(obj.HoTen);
                        $("#txtNgaySinh").val(obj.NgaySinh);
                        $("#txtEmail").val(obj.Email);
                        $("#txtSDT").val(obj.SDT);
                        $("#txtDiaChiQue").val(obj.DiaChi_Que);
                        $("#txtDiaChiHienTai").val(obj.DiaChi_HienTai);
                        $("#txtSoCCCD").val(obj.SoCCCD);
                        $("#txtGhiChu").val(obj.Note);
                        $("#txtTruyCapLink").val(obj.LinkHoSoUngVien);

                        $("#DropGioiTinh").val(obj.GioiTinh).trigger('change');
                        $("#DropHocVan").val(obj.tbl_Category_HocVanId).trigger('change');
                        $("#DropDanToc").val(obj.tbl_Category_DanTocId).trigger('change');
                        $("#DropTonGiao").val(obj.tbl_Category_TonGiaoId).trigger('change');
                        $("#DropQueQuan_Tinh").val(obj.tblCategory_Que_TinhId).trigger('change');
                        $("#DropQueQuan_Huyen").val(obj.tblCategory_Que_HuyenId).trigger('change');
                        $("#DropHienTai_Tinh").val(obj.tblCategory_HienTai_TinhId).trigger('change');
                        $("#DropHienTai_Huyen").val(obj.tblCategory_HienTai_HuyenId).trigger('change');
                        $("#DropChucVu").val(obj.tbl_Category_ChucVuId).trigger('change');
                        $("#DropPhongBan").val(obj.tbl_PhongBanId).trigger("change");
                        $("#DropCoSo").val(obj.tbl_CoSoId).trigger('change');
                        $("#DropNoiCapCCCD_Tinh").val(obj.tblCategory_NoiCap_TinhId).trigger('change'); 
                        $('#bd_TrangThaiNS').data('value', obj.TinhTrang);

                        
                        
                        if (me.type == 'copy') {
                            $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-primary');
                            $('#bd_TrangThaiNS').text('Khởi tạo (chờ xét duyệt)');
                        } else { 
                            me.filter_lst_DuyetUngVien();
                            me.filter_lst_ThayDoiNS();
                            switch (obj.TinhTrang) {
                                case 0:
                                    $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-info');
                                    $('#bd_TrangThaiNS').text('Trong quá trình tuyển dụng');
                                    me.type = 'HSTD';
                                    me.TuyenDungId = obj.tbl_TuyenDungId;
                                    break;
                                case 1:
                                    $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-primary');
                                    $('#bd_TrangThaiNS').text('Khởi tạo (chờ xét duyệt)');
                                    break;
                                case 2:
                                    $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-success');
                                    $('#bd_TrangThaiNS').text('Hoạt động (đang làm việc)');
                                    if ((me.roleId != 1) && (me.roleId != 99)) { 
                                        const idsToDisable = [
                                            "txtHoTen", "txtNgaySinh", "DropGioiTinh",
                                            "txtEmail", "DropDanToc",
                                            "DropQueQuan_Tinh", "DropQueQuan_Huyen", "txtDiaChiQue",
                                            "txtSoCCCD", "DropNoiCapCCCD_Tinh", "txtGhiChu",
                                            "DropChucVu", "DropPhongBan", "DropCoSo"
                                        ];

                                        idsToDisable.forEach(id => {
                                            $("#" + id).prop("disabled", true);
                                        });
                                    }
                                    break;
                                case 3:
                                    $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-danger');
                                    $('#bd_TrangThaiNS').text('Từ chối duyệt (nghỉ việc)');
                                    $('#btnHDLD').prop('hidden', true);
                                    break;
                                default:
                                    $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-warning');
                                    $('#bd_TrangThaiNS').text('Không xác định');
                                    break;
                            }
                            if (me.type == 'HSTD') { 
                                switch (obj.TinhTrangHoSoTD || 1) {
                                    case 1:
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-primary');
                                        $('#bd_TrangThaiTD').text('Nộp hồ sơ (Ứng tuyển)');
                                        break;
                                    case 2:
                                        $("#btnSave_T").hide();
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-info');
                                        $('#bd_TrangThaiTD').text('Ứng tuyển đạt (Chờ phỏng vấn)');
                                        break;
                                    case 3:
                                        $("#btnSave_T").hide();
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-secondary');
                                        $('#bd_TrangThaiTD').text('Kết thúc phỏng vấn (Chờ thông báo)');
                                        $("#btnSave_T").hide();
                                        break;
                                    case 4:
                                        $("#btnSave_T").hide();
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-success');
                                        $('#bd_TrangThaiTD').text('Kết quả đạt (Chờ xét duyệt)');
                                        $("#btnSave_T").hide();
                                        break;
                                    case 5:
                                        $("#btnSave_T").hide();
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-danger');
                                        $('#bd_TrangThaiTD').text('Kết quả không đạt (Loại)');
                                        break;
                                    default:
                                        $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-warning');
                                        $('#bd_TrangThaiTD').text('Không xác định');
                                        break; 
                                }
                            } 
                        } 
                    }
                    else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            }, 
        });
    },  
    getData_ByTuyenDungId: function (id) {
        var me = this;
        let jsonData = {
            'Id': id 
        };
        $.ajax({
            type: 'POST',
            url: '/TuyenDung/GetTuyenDungById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) { 

                        $("#DropChucVu").val(obj.tbl_Category_ChucVuId).trigger('change');
                        $("#DropPhongBan").val(obj.tbl_PhongBanId).trigger("change");
                        $("#DropCoSo").val(obj.tbl_CoSoId).trigger('change'); 
                        $('#bd_TrangThaiNS').data('value', obj.TinhTrang);

                        $("#DropChucVu").prop('disabled', true);
                        $("#DropPhongBan").prop('disabled', true);
                        $("#DropCoSo").prop('disabled', true);
                        $("#txtMaNhanVien").val('');    
;
                        $("#z_TrangThaiNS").prop('hidden', true);
                        $("#z_TrangThaiTD").prop('hidden', false);  

                        switch (obj.TinhTrangHoSoTD || 1) {
                            case 1:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-primary');
                                $('#bd_TrangThaiTD').text('Nộp hồ sơ (Ứng tuyển)');
                                break;
                            case 2:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-Info');
                                $('#bd_TrangThaiTD').text('Ứng tuyển đạt (Chờ phỏng vấn)');
                                break;
                            case 3:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-Secondary');
                                $('#bd_TrangThaiTD').text('Kết thúc phỏng vấn (Chờ thông báo)');
                                $("#btnSave_T").hide(); 
                                break;
                            case 4:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-success');
                                $('#bd_TrangThaiTD').text('Kết quả đạt (Chờ xét duyệt)');
                                $("#btnSave_T").hide();
                                break;
                            case 5:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-Danger');
                                $('#bd_TrangThaiTD').text('Kết quả không đạt (Loại)');
                                break;
                            default:
                                $('#bd_TrangThaiTD').removeClass('bg-primary').addClass('bg-warning');
                                $('#bd_TrangThaiTD').text('Không xác định');
                                break; 
                        }
                    }
                    else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            }, 
        });
    },  
    add_account: function () {
        var me = this;
        let HoTen = $("#txtHoTen").val();
        let Email = $("#txtEmail").val();
        let tbl_PhongBanId = $("#DropPhongBan").val();
        let tbl_CoSoId = $("#DropCoSo").val();
        let tbl_Category_ChucVuId = $("#DropChucVu").val();
        let valName = $("#DropChucVu").find("option:selected").attr("name");
        let definePhongBan = $("#DropPhongBan").val();
        var definedrole = $("#DropChucVu").find("option:selected").attr("role");
        var role; 
        switch (valName) {
            case 'PTGD':
                role = 1;
                break;
            case 'GD':
            case 'PGD':
                role = 2;
                break;
            case 'TP':
            case 'PP':
                role = 3;
                break;
            case 'NS':
            case 'NSPT':
            case 'NSTV':
                role = 4;
                break;
        }
        if (!role) {
            if (!tbl_CoSoId) { role = 1; }
            else if (!tbl_PhongBanId) { role = 2; }
            else {
                if (definedrole == 3) {
                    role = 3;
                } else { role = 4; }
            }
        }
        
        var jsonData =
        {
            'Name': HoTen,
            'RoleId': role,
            'Password': 'Abcdef1234.',
            'Gmail': Email,
            'CompanyId': Core.companyId,
            'CoSoId': tbl_CoSoId || '', 
            'PhongBanId': tbl_PhongBanId || '', 
            'C3': (definePhongBan === 'D0D7A8A7-9452-4470-81A6-ADDC2A9FB73C' || !definePhongBan) ? 'NHANSU' : '-1', // dùng tạm
            'ChucVuId': tbl_Category_ChucVuId,
            'StatusId': (me.roleId == 99 || me.roleId == 1 || me.roleId == 2) ? 1 : 2,
            'CreatedDate': new Date().toISOString(),
            'CreatedBy': Core.userName,
            'Id': '',
        }; 
        $.ajax({
            type: 'POST',
            url: '/Register/Save_NhanVien',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 


                    Core.showModal_Confirm(
                        'Thông báo',
                        'Hệ thống đã tự động tạo mới tài khoản cho nhân sự này! </br> Tài khoản của nhân sự sau khi tạo mới thành công là:</br> Email:<span class="text-primary"> ' + Email + '</span></br> Mật khẩu: <span class="text-primary">Abcdef1234.</span> </br> <em><span class="text-primary">Lưu ý lưu lại thông tin tài khoản trước khi lưu.Tài khoản chỉ sử dụng được sau khi hồ sơ nhân sự của bạn ở tình trạng hoạt động!</span></em>'
                    );
                    $("#btnYes").click(function (e) {
                        $('#modalconfirm').modal('hide');
                        Core.showModal_Confirm(
                            'Thông báo',
                            'Thành công! Đang chuyển hướng về trang danh sách...'
                        );
                        $('.modal-footer').hide();
                        setTimeout(function () {

                            window.open('/NhanSu/ListNhanSuView', '_self');

                        }, 2500);
                    }); 
                } else {
                    Core.showToast(response.Message, 'danger');
                } 
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            }, 
        });
    },
    update_capnhat_trangThai: function (str_Id, statusId) {
        var me = this;
        var jsonData =
        {
            'C1': str_Id,
            'StatusId': statusId,
            'ModifyBy': Core.userName,
        };
        Core.startButtonLoading("btnRecycleBin");
        $.ajax({
            type: 'POST',
            url: '/NhanSu/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                } else {
                    Core.showToast(response.Message, 'danger');
                }
                Core.stopButtonLoading('btnRecycleBin');
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            }, 
        });
    },
    /*Utility*/ 
    reset: function () {
        var me = this; 
        if (!me.Id) { 
            $("#txtMaNhanVien").val("");
        }
        $("#txtHoTen").val("");
        $("#txtNgaySinh").val("");
        $("#txtEmail").val("");
        $("#txtSDT").val("");
        $("#txtDiaChiQue").val("");
        $("#txtDiaChiHienTai").val("");
        $("#txtSoCCCD").val("");
        $("#txtGhiChu").val("");

        $("#DropGioiTinh").val("NA").trigger('change');
        $("#DropHocVan").val("").trigger('change');
        $("#DropDanToc").val("").trigger('change');
        $("#DropTonGiao").val("").trigger('change');
        $("#DropQueQuan_Tinh").val("").trigger('change');
        $("#DropQueQuan_Huyen").val("").trigger('change');
        $("#DropQueQuan_Huyen").prop('disabled', true);
        $("#DropHienTai_Tinh").val("").trigger('change');
        $("#DropHienTai_Huyen").val("").trigger('change');
        $("#DropHienTai_Huyen").prop('disabled', true);
        $("#DropChucVu").val("").trigger('change');
        $("#DropPhongBan").val("").trigger('change');
        $("#DropCoSo").val("").trigger('change');
        $("#DropNoiCapCCCD_Tinh").val("").trigger('change'); 
        me.StatusId_Edit = 1;
        me.Id = me.Id;
    },
    disableByRoleId: function () {
        var me = this;
        if (me.Id && !me.type) {
            $('#btnReset_T').prop('hidden', true);
            $('#btnHDLD').prop('hidden', false);
        }
        if (!me.Id && !me.type) {
            $('#btnThemMoi_T').prop('hidden', true); 
        }
        if ((me.roleId == 4) && (me.type != 'HSTD')) { 
            $("#btnBack_T").hide();
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $("#btnXoa_T").hide();  
            const idsToDisable = [
                "txtHoTen", "txtNgaySinh", "DropGioiTinh", 
                "txtEmail", "DropDanToc", 
                "DropQueQuan_Tinh", "DropQueQuan_Huyen", "txtDiaChiQue",
                "txtSoCCCD", "DropNoiCapCCCD_Tinh", "txtGhiChu",
                "DropChucVu", "DropPhongBan", "DropCoSo"
            ];
             
            idsToDisable.forEach(id => {
                $("#" + id).prop("disabled", true);
            });
        } 
        if ((me.Id) && (me.type == 'noHSTD')) {  
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $("#btnSave_T").hide();
        } 
        if (me.roleId == 3 && me.tkC3 != 'NHANSU') { 
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $("#btnXoa_T").hide();  
            if (Core.tknhansuId != Core.exportValueUrl('id')) {
                $("#btnHDLD").hide();  
                $("#btnSave_T").hide();  
            }
            if (me.type == 'HSTD') {
                $("#btnSave_T").hide();   
            }
        }
        let chekval = $("#DropCoSo").val();
        if (!chekval || me.type == 'HSTD') {
            $('#DropPhongBan').prop('disabled', true);
        }
        if (me.TuyenDungId) {
            $("#btnThemMoi_T").prop('hidden', true);
            $("#line_chiaDong").prop('hidden', true);
            $("#zone_lstTuyenDung").prop('hidden', true);

        } 
        if (me.type == 'HSTD' || me.type == 'noHSTD') {
            $('#lbTieuDe').html('THÔNG TIN ỨNG VIÊN');
            $('#DropChucVu').prop('disabled', true);
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $('#z_TrangThaiTD').prop('hidden', false);
        } else {
            $("#table1").prop('hidden', true);
            $("#table1-tab").prop('hidden', true);
            $('#table2').addClass('show active');
        } 
        if ((me.type != 'HSTD') && (me.type != 'noHSTD')) {
            $('#z_linkCV').prop('hidden', true);
        } else {
            $('#table2').prop('hidden', true); 
            $('#table2-tab').prop('hidden', true); 
        }
        if ((!me.Id && !me.type) || me.type == 'copy') { 
            $('#zone_lstTuyenDung').prop('hidden', true); 
            $('#line_chiaDong').prop('hidden', true); 
        }
        if (me.roleId == 99) {
            Core.loadDrop_Company('DropCongTy', 'Chọn công ty', '');
            $('#z_Congty').prop('hidden', false); 
        }
    }, 



    /*CRUD*/
    filter_lst_DuyetUngVien: function () {
        var me = this;
        var jsonData = { 
            tbl_NhanSuId: me.Id, 
        };

        // Tách cấu hình DataTables
        var dtConfig = {
            "paging": true,
            "pageLength": 25,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": true,
            "autoWidth": false,
            "processing": true,
            "serverSide": true,
            "destroy": true,
            "ajax": {
                "url": '/NhanSu/LichSuXetDuyet_Search',
                "type": 'POST',
                "data": function (d) {
                    $.extend(d, jsonData);
                    d.pageIndex = d.start / d.length + 1;
                    d.pageSize = d.length;
                    return d;
                },
                "dataFilter": function (data) {
                    var json = JSON.parse(data);
                    json.recordsTotal = json.TotalRows;
                    json.recordsFiltered = json.TotalRows;
                    json.data = json.Data;
                    if ((me.type != 'HSTD') && (me.type != 'noHSTD')) {
                        if ((json.TotalRows < 1) && !me.type) {
                            $("#table1").prop('hidden', true);
                            $("#table1-tab").prop('hidden', true);
                            $('#table2').addClass('show active');
                        }
                    }
                    return JSON.stringify(json);
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [6, 7]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7]
            }
            ], 
            //"order": [[1, "asc"]]
            "columns": [
                { "data": "Id", "visible": false },
                { "data": "RowNum", "className": "text-center" },
                { "data": "HoTenNguoiDuyet", "className": "text-center" },
                { "data": "tbl_Category_ChucVuName", "className": "text-center" },  
                { "data": "ModifyDate", "className": "text-center" }, 
                { "data": "Note", "className": "text-center" },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrangHSTD_TruocDuyet) {
                            case 1:
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';
                                badgeText = 'Nộp hồ sơ (Ứng tuyển)';
                                break;
                            case 2:
                                badgeClass = 'badge rounded-pill border border-info text-info fs-7';
                                badgeText = 'Ứng tuyển đạt (Chờ phỏng vấn)';
                                break;
                            case 3:
                                badgeClass = 'badge rounded-pill border border-secondary text-secondary fs-7';
                                badgeText = 'Kết thúc phỏng vấn (Chờ thông báo)';
                                break;
                            case 4:
                                badgeClass = 'badge rounded-pill border border-success text-success fs-7';
                                badgeText = 'Kết quả đạt (Chờ xét duyệt)';
                                break;
                            case 5:
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';
                                badgeText = 'Kết quả loại (Kết thúc)';
                                break;
                            default:
                                badgeClass = 'badge rounded-pill border border-warning text-warning fs-7';
                                badgeText = 'Không xác định';
                        }

                        return `<h4><span title="Tình trạng của hồ sơ ứng tuyển" class="${badgeClass}">${badgeText}</span></h4>`;
                    }
                } , 
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrangHSTD_SauDuyet) {
                            case 1:
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';
                                badgeText = 'Nộp hồ sơ (Ứng tuyển)';
                                break;
                            case 2:
                                badgeClass = 'badge rounded-pill border border-info text-info fs-7';
                                badgeText = 'Ứng tuyển đạt (Chờ phỏng vấn)';
                                break;
                            case 3:
                                badgeClass = 'badge rounded-pill border border-secondary text-secondary fs-7';
                                badgeText = 'Kết thúc phỏng vấn (Chờ thông báo)';
                                break;
                            case 4:
                                badgeClass = 'badge rounded-pill border border-success text-success fs-7';
                                badgeText = 'Kết quả đạt (Chờ xét duyệt)';
                                break;
                            case 5:
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';
                                badgeText = 'Kết quả loại (Kết thúc)';
                                break;
                            default:
                                badgeClass = 'badge rounded-pill border border-warning text-warning fs-7';
                                badgeText = 'Không xác định';
                        }

                        return `<h4><span title="Tình trạng của hồ sơ ứng tuyển" class="${badgeClass}">${badgeText}</span></h4>`;
                    }
                } ,
            ],
            "drawCallback": function (settings) {
                $("#loading-spinner").hide();
                // Đảm bảo cột ID luôn ẩn sau khi vẽ lại bảng
                var api = this.api();
                api.column(0).visible(false);
            },
            "language": {
                "search": "Tìm kiếm theo từ khóa:",
                "lengthMenu": "Hiển thị _MENU_ dữ liệu",
                "zeroRecords": "Không có dữ liệu nào được tìm thấy!",
                "info": "Hiển thị _START_ đến _END_ trong _TOTAL_ dữ liệu",
                "infoEmpty": "Hiển thị 0 đến 0 của 0 dữ liệu",
                "infoFiltered": "(Dữ liệu tìm kiếm trong _MAX_ dữ liệu)",
                "processing": "Đang tải dữ liệu...",
                "emptyTable": "Không có dữ liệu nào được tìm thấy!",
                "paginate": {
                    "first": "Đầu",
                    "last": "Cuối",
                    "next": "Tiếp theo",
                    "previous": "Quay lại"
                }
            },
            "initComplete": function (settings, json) {
                // Đảm bảo cột ID luôn ẩn sau khi khởi tạo
                var api = this.api();
                api.column(0).visible(false);
            }
        };

        $("#loading-spinner").show();
        var table = $('#tbldata_duyet').DataTable(dtConfig);

    },

    filter_lst_ThayDoiNS: function () {
        var me = this;
        var jsonData = {
            tbl_NhanSuId: me.Id,
        };

        // Tách cấu hình DataTables
        var dtConfig = {
            "paging": true,
            "pageLength": 25,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": true,
            "autoWidth": false,
            "processing": true,
            "serverSide": true,
            "destroy": true,
            "ajax": {
                "url": '/NhanSu/LichSuThayDoi_Search',
                "type": 'POST',
                "data": function (d) {
                    $.extend(d, jsonData);
                    d.pageIndex = d.start / d.length + 1;
                    d.pageSize = d.length;
                    return d;
                },
                "dataFilter": function (data) {
                    var json = JSON.parse(data);
                    json.recordsTotal = json.TotalRows;
                    json.recordsFiltered = json.TotalRows;
                    json.data = json.Data;
                    //if ((json.TotalRows < 1) && !me.type) {
                    //    $("#table1").prop('hidden', true);
                    //    $("#table1-tab").prop('hidden', true);
                    //    $('#table2').addClass('show active');
                    //}
                    return JSON.stringify(json);
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [6, 7]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7]
            }
            ],
            //"order": [[1, "asc"]]
            "columns": [
                { "data": "Id", "visible": false },
                { "data": "RowNum", "className": "text-center" },
                { "data": "HoTenNguoiThayDoi", "className": "text-center" },
                { "data": "tbl_Category_ChucVuNguoiThayDoiName", "className": "text-center" },
                { "data": "ModifyDate", "className": "text-center" },
                { "data": "Note", "className": "text-center" }, 
                { "data": "tbl_Category_ChucVuName", "className": "text-center" }, 
                { "data": "tbl_PhongBanName", "className": "text-center" }, 
                { "data": "tbl_CoSoName", "className": "text-center" }, 
            ],
            "drawCallback": function (settings) {
                $("#loading-spinner").hide();
                // Đảm bảo cột ID luôn ẩn sau khi vẽ lại bảng
                var api = this.api();
                api.column(0).visible(false);
            },
            "language": {
                "search": "Tìm kiếm theo từ khóa:",
                "lengthMenu": "Hiển thị _MENU_ dữ liệu",
                "zeroRecords": "Không có dữ liệu nào được tìm thấy!",
                "info": "Hiển thị _START_ đến _END_ trong _TOTAL_ dữ liệu",
                "infoEmpty": "Hiển thị 0 đến 0 của 0 dữ liệu",
                "infoFiltered": "(Dữ liệu tìm kiếm trong _MAX_ dữ liệu)",
                "processing": "Đang tải dữ liệu...",
                "emptyTable": "Không có dữ liệu nào được tìm thấy!",
                "paginate": {
                    "first": "Đầu",
                    "last": "Cuối",
                    "next": "Tiếp theo",
                    "previous": "Quay lại"
                }
            },
            "initComplete": function (settings, json) {
                // Đảm bảo cột ID luôn ẩn sau khi khởi tạo
                var api = this.api();
                api.column(0).visible(false);
            }
        };

        $("#loading-spinner").show();
        var table = $('#tbldata_thaydoi').DataTable(dtConfig);

    },


    /*HDLD_lstBangLuong*/
    saveHDLD: function () {
        var me = this;  
        let MaHD = $('#txtMaHopDong').val();
        let LoaiHD = $('#DropLoaiHD').val();
        let NgayTaoHD = $('#txtNgayTaoHD').val();
        let NgayKyHD = $('#txtNgayKyHD').val();
        let MucLuongKyHD = $('#txtMucLuongKyHD').val().replace(/\./g, '');
        let SoCongHangThang = $('#txtSoCongHangThang').val();
        let MucTienBH = $('#txtMucTienBH').val().replace(/\./g, '');
        let MoTaChiTiet = $('#txtMoTa').val()

        let tbl_Category_ChucVuId = $("#DropChucVu").val();
        let tbl_PhongBanId = $("#DropPhongBan").val();
        let tbl_CoSoId = $("#DropCoSo").val(); 
        let tinhTrang_HSNS = $('#bd_TrangThaiNS').data('value'); 

        let jsonData = {
            'MaHD': MaHD,
            'LoaiHD': LoaiHD,
            'NgayTaoHD': NgayTaoHD,
            'NgayKyHD': NgayKyHD, 
            'MucLuongKyHD': MucLuongKyHD,
            'MucTienBH': MucTienBH,  
            'SoCongHangThang': SoCongHangThang,
            'tbl_NhanSuId': Core.exportValueUrl('id'),
            'tbl_CoSoId': tbl_CoSoId,
            'tbl_PhongBanId': tbl_PhongBanId,
            'tbl_Category_ChucVuId': tbl_Category_ChucVuId,  
            'tbl_CompanyId': me.roleId == 99 ? $('#z_Congty').val() : me.CongTyId,
            'CreatedBy': Core.userName,
            'TinhTrang': tinhTrang_HSNS,
            'StatusId': 1,
            'MoTaChiTiet': MoTaChiTiet,
            'RoleId': me.roleId, // đây là id người tạo và người sửa để xác định quyền chỉnh sửa, không phỉa role của nhân. bên trên là role của nhân sự 

            'Id': "", 
        }; 

        Core.startButtonLoading("btnSaveHD");

        $.ajax({
            type: 'POST',
            url: '/HDLD_lstBangLuong/Save',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                } else {
                    Core.showToast(response.Message, 'danger');
                }
                $("#staticBackdrop").modal('hide');
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {
                Core.stopButtonLoading("btnSaveHD");
            }
        });
    },
    getDataByNhanSuId_HDLD: function (id) {
        var me = this;
        let jsonData = {
            'NhanSuId': id
        };
        $.ajax({
            type: 'POST',
            url: '/HDLD_lstBangLuong/GetHDLD_lstBangLuongByNhanSuId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                        $('#txtMaHopDong').val(obj.MaHD);
                        $('#DropLoaiHD').val(obj.LoaiHD).trigger('change');
                        $('#txtNgayTaoHD').val(obj.NgayTaoHD);
                        $('#txtNgayKyHD').val(obj.NgayKyHD);
                        $('#txtMucLuongKyHD').val(obj.MucLuongKyHD);
                        $('#txtSoCongHangThang').val(obj.SoCongHangThang);
                        $('#txtMucTienBH').val(obj.MucTienBH);
                        $('#txtMoTa').val(obj.MoTaChiTiet);
                        if ((obj.RoleId < me.roleId) || (me.roleId == 99)) {
                            $("#btnSaveHD").prop('hidden', true);
                        }
                    }
                    else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'warning');
                    if ((me.tkC3 != 'NHANSU') && (me.roleId == 4)){
                        $("#btnSaveHD").prop('hidden', true);
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
        });
    },  

}; 