function DetailTuyenDung() { } 
DetailTuyenDung.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    tkcosoId: '',
    tkphongbanId: '',
    userName: '',
    RecoverMode: false,
    jsValid: '#txtTenTuyenDung, #txtMoTa, #txtYeuCau, #DropCoSo, #DropPhongBan, #DropChucVu, #txtSoLuong, #txtMucLuongTu, #txtMucLuongDen, #txtLinkTuyenDung, #txtNgayBatDau, #txtHanNopHoSo, #txtNgayKetThuc',
    session: '', 
    type: '',
    TuyenDungId: '',
    TT_HoSoNS: '',
    tkC3: '',
    getDataCoSoId: '',
    getDataPhongBanId: '', 
    getDataChucVuId: '', 

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
        Core.loadDrop_PhongBan('DropPhongBan', 'Chọn phòng ban', '');
        //Core.loadDrop_NhanSu('DropNhanSu', 'Chọn nhân sự', '', me.tkcosoId, 'D0D7A8A7-9452-4470-81A6-ADDC2A9FB73C');
        Core.loadDrop_Category('DropChucVu', 'Chọn chức vụ', '', 'DMCV', 9); 
         
        if (me.Id) { 
            setTimeout(function () {
                me.getDataById(me.Id);
            }, 1050);  
        } 
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
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.save();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $("#btnBack_T").click(function (e) {
            window.open('/TuyenDung/ListTuyenDungView', '_self'); 
        });
        $("#btnReset_T").click(function (e) {

            let valName = $("#DropPhongBan").find("option:selected").attr("name");
            console.log(valName,'kkkk')
            me.reset(); 
        });
        $("#btnThemMoi_T").click(function (e) {
            window.open('/TuyenDung/DetailTuyenDungView', '_self');
        }); 
        $("#btnThemMoi_NS").click(function (e) {
            window.open('/NhanSu/DetailNhanSuView?TuyenDungId=' + me.Id + '&type=HSTD', '_self');
        });  
        $('#DropCoSo').on('change', function () {
            var selectedValue = $(this).val();
            if (selectedValue) {
                $('#DropPhongBan').prop('disabled', false);
            } else {
                $('#DropPhongBan').prop('disabled', true);
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

        $(document).delegate('.action-icon', 'click', function () { 
            var id = this.id;
            var type = this.type;
            if (id == '' || id == undefined || id == null) return;
            switch (type) {
                case 'edit': 
                    window.open('/NhanSu/DetailNhanSuView?id=' + id + '&type=HSTD', '_self');
                    break;
                case 'delete':
                    Core.showModal_Confirm('Thông báo', 'Bạn có chắc chắn muốn xóa vào thùng rác?');
                    $("#btnYes").click(function (e) {
                        $('#modalconfirm').modal('hide');
                        me.update_capnhat_trangThai(id, me.StatusCode.Deleted);
                    });
                    break; 
            }
        });   
    },
    init_action: function () {
        var me = this;
    },  
    /*CRUD*/
    filter_lst_UngVien: function () {
        var me = this; 
        var jsonData = {
            Keyword: '',
            tbl_CompanyId: me.CongTyId, 
            tbl_CoSoId: me.getDataCoSoId, 
            tbl_PhongBanId: me.getDataPhongBanId,
            tbl_Category_ChucVuId: me.getDataChucVuId, 
            tbl_TuyenDungId: me.Id, 
            TinhTrang:  0,
            StatusId: 1,
        };

        // Tách cấu hình DataTables
        var dtConfig = {
            "paging": true,
            "pageLength": 10,
            "lengthChange": false,
            "searching": false,
            "ordering": false,
            "info": true,
            "autoWidth": false,
            "processing": true,
            "serverSide": true,
            "destroy": true,
            "ajax": {
                "url": '/NhanSu/FilterNhanSu',
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
                    return JSON.stringify(json);
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [6, 7, 8]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "MaNhanVien", "className": "text-center" },
                { "data": "HoTen", "className": "text-center" },
                {
                    "data": "GioiTinh",
                    "className": "text-center",
                    "render": function (data) {
                        if (data === 'NA') {
                            return 'Nam';
                        } else if (data === 'NU') {
                            return 'Nữ';
                        }else if (data === 'KH') {
                            return 'Khác';
                        } else {
                            return data;   
                        }
                    }
                },
                { "data": "NgaySinh", "className": "text-center" }, 
                { "data": "Email", "className": "text-center" },
                { "data": "SDT", "className": "text-center" },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrangHoSoTD) {
                            case 1:  
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';  
                                badgeText = 'Nộp hồ sơ (Ứng tuyển)';
                                break;
                            case 2:  
                                badgeClass = 'badge rounded-pill border border-Info text-Info fs-7';  
                                badgeText = 'Ứng tuyển đạt (Chờ phỏng vấn)';
                                break;
                            case 3:  
                                badgeClass = 'badge rounded-pill border border-Secondary text-Secondary fs-7';  
                                badgeText = 'Kết thúc phỏng vấn (Chờ thông báo)';
                                break;
                            case 4:  
                                badgeClass = 'badge rounded-pill border border-success text-danger fs-7';  
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
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data) {
                        var dropdown = '<a title="Chỉnh sửa" id="' + data + '" type="edit" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';  
                        return dropdown;
                    }
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data) {
                        var str = '<div class="atp-nowrap">';
                        if (!me.RecoverMode) {
                            str += '<a title="Xóa dữ liệu" id="' + data + '" type="delete" class="action-icon text-success btnXoa" href="javascript:void(0);"><i class="fa-solid fa-trash"></i></a>';
                        }
                        else {
                            str += '<a title="Khôi phục dữ liệu" id="' + data + '" type="recover" class="action-icon text-success btnKhoiPhuc" href="javascript:void(0);"><i class="fa-solid fa-rotate-right"></i></a>';
                        }
                        return str;
                    }
                } 
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
        var table = $('#tbldata').DataTable(dtConfig);
         
    },
    save: function () {
        var me = this;
        let MaTuyenDung = $('#txtMaTuyenDung').val();
        let TenTuyenDung = $('#txtTenTuyenDung').val();
        let MoTa = $('#txtMoTa').val();
        let YeuCau = $('#txtYeuCau').val();
        let tbl_CoSoId = $('#DropCoSo').val();
        let tbl_PhongBanId = $('#DropPhongBan').val();
        let tbl_Category_ChucVuId = $('#DropChucVu').val();
        let SoLuong = $('#txtSoLuong').val();
        let MucLuongTu = $('#txtMucLuongTu').val();
        let MucLuongDen = $('#txtMucLuongDen').val();
        let LinkTuyenDung = $('#txtLinkTuyenDung').val();
        let NgayBatDau = $('#txtNgayBatDau').val();
        let HanNopHoSo = $('#txtHanNopHoSo').val();
        let NgayKetThuc = $('#txtNgayKetThuc').val();
        let tinhTrang_HSNS = $('#bd_TrangThaiNS').data('value');
        let tinhTrang;

        if (me.Id) {
            if (me.type == 'copy') {
                if (me.roleId == 1 || me.roleId == 99 || me.roleId == 2) {
                    tinhTrang = 2;
                } else {
                    tinhTrang = 1;
                }

            } else {
                tinhTrang = tinhTrang_HSNS || 1;
            }
        } else {
            if (me.roleId == 99 || me.roleId == 1 || me.roleId == 2) {
                tinhTrang = 2;
            } else {
                tinhTrang = 1;
            }
        }   

        // Định dạng dữ liệu thành JSON để gửi xuống server
        let jsonData = {
            'MaTuyenDung': me.type ? '' : MaTuyenDung,
            'TenTuyenDung': TenTuyenDung,
            'MoTa': MoTa,
            'YeuCau': YeuCau,
            'tbl_CoSoId': tbl_CoSoId,
            'tbl_PhongBanId': tbl_PhongBanId,
            'tbl_Category_ChucVuId': tbl_Category_ChucVuId,
            'SoLuong': SoLuong,
            'MucLuongTu': MucLuongTu,
            'MucLuongDen': MucLuongDen,
            'LinkTuyenDung': LinkTuyenDung,
            'NgayBatDau': NgayBatDau,
            'HanNopHoSo': HanNopHoSo,
            'NgayKetThuc': NgayKetThuc,
            'tbl_CompanyId': me.CongTyId,
            'CreatedBy': Core.userName,
            'TinhTrang': tinhTrang,
            'StatusId': me.StatusId_Edit,
            'Id': me.type ? '' : me.Id,
        }; 
       
          
         Core.startButtonLoading("btnSave");
         
        $.ajax({
            type: 'POST',
            url: '/TuyenDung/Save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');  
                    Core.showModal_Confirm(
                         'Thông báo',
                         'Thành công! Đang chuyển hướng về trang danh sách...'
                     );
                     $('.modal-footer').hide();
                    setTimeout(function () {
                        
                        window.open('/TuyenDung/ListTuyenDungView', '_self');
                         
                    }, 3000);

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
            url: '/TuyenDung/GetTuyenDungById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {  
                        me.getDataCoSoId = obj.tbl_CoSoId;
                        me.getDataPhongBanId = obj.tbl_PhongBanId;
                        me.getDataChucVuId = obj.tbl_Category_ChucVuId;

                        if (obj.TinhTrang == 2) {
                            $("#line_chiaDong").prop('hidden', false);
                            $("#zone_lstTuyenDung").prop('hidden', false); 
                            me.filter_lst_UngVien(); 
                            $(".form-control, .custom-textarea, .form-custom").prop("disabled", true);
                        }
                        if (obj.TinhTrang == 3) {
                            $("#btnSave_T").hide();
                            $("#btnReset_T").hide();
                            $("#btnThemMoi_T").hide();
                            $("#btnXoa_T").hide();
                            $(".form-control, .custom-textarea, .form-custom").prop("disabled", true);
                        }
                        


                        $("#txtMaTuyenDung").val(obj.MaTuyenDung);
                        $("#txtTenTuyenDung").val(obj.TenTuyenDung);
                        $("#txtMoTa").val(obj.MoTa);
                        $("#txtYeuCau").val(obj.YeuCau);
                        $("#txtSoLuong").val(obj.SoLuong);
                        $("#txtMucLuongTu").val(obj.MucLuongTu);
                        $("#txtMucLuongDen").val(obj.MucLuongDen);
                        $("#txtLinkTuyenDung").val(obj.LinkTuyenDung);
                        $("#txtNgayBatDau").val(obj.NgayBatDau);
                        $("#txtHanNopHoSo").val(obj.HanNopHoSo);
                        $("#txtNgayKetThuc").val(obj.NgayKetThuc);
                         
                        $("#DropChucVu").val(obj.tbl_Category_ChucVuId).trigger('change');
                        $("#DropPhongBan").val(obj.tbl_PhongBanId).trigger("change");
                        $("#DropCoSo").val(obj.tbl_CoSoId).trigger('change'); 
                        $('#bd_TrangThaiNS').data('value', obj.TinhTrang);

                        switch (obj.TinhTrang) {
                            case 1:
                                $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-primary');
                                $('#bd_TrangThaiNS').text('Chờ xét duyệt');
                                break;
                            case 2:
                                $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-info');
                                $('#bd_TrangThaiNS').text('Đã duyệt(Đang tuyển)');
                                break;
                            case 3:
                                $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-success');
                                $('#bd_TrangThaiNS').text('Hoàn thành');
                                break;
                            case 4:
                                $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-danger');
                                $('#bd_TrangThaiNS').text('Từ chối duyệt ');
                                break;
                            default:
                                $('#bd_TrangThaiNS').removeClass('bg-primary').addClass('bg-warning');
                                $('#bd_TrangThaiNS').text('Không xác định');
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
            url: '/TuyenDung/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filterTuyenDung(); 
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
            $("#MaTuyenDung").val("");
        }
        var today = new Date();
        var formattedToday = ("0" + today.getDate()).slice(-2) + "/" +
            ("0" + (today.getMonth() + 1)).slice(-2) + "/" +
            today.getFullYear();

        $("#txtTenTuyenDung").val("");
        $("#txtMoTa").val("");
        $("#txtYeuCau").val("");
        $("#txtSoLuong").val("");
        $("#txtMucLuongTu").val("");
        $("#txtMucLuongDen").val("");
        $("#txtLinkTuyenDung").val("");
         
        $("#txtNgayBatDau").val(formattedToday);
        $("#txtHanNopHoSo").val(formattedToday);
        $("#txtNgayKetThuc").val(formattedToday);

        if (me.tkcosoId) {
            $("#DropCoSo").val(me.tkcosoId).trigger('change');
        } else {
            $("#DropCoSo").val("").trigger('change');
        }
       
        $("#DropPhongBan").val("").trigger('change');
        $("#DropChucVu").val("").trigger('change'); 
        me.StatusId_Edit = 1;
        me.Id = me.Id;
    },
    disableByRoleId: function () {
        var me = this;
        if (me.Id && !me.type) {
            $('#btnXoa_T').prop('hidden', false);
        }
        if ((me.roleId == 4) && (me.type != 'HSTD')) { 
            $("#btnBack_T").hide();
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $("#btnXoa_T").hide();
        }
        if ((me.roleId == 3 && me.tkC3 != 'NHANSU') || me.roleId == 4 && me.tkC3 != 'NHANSU') {
            $("#z_button").hide();
        }
    }, 
}; 