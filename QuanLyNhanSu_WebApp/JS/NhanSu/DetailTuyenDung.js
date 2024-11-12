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
    jsValid_Duyet: '#DropTinhTrang_DuyetHSTD',
    jsValid: '#txtTenTuyenDung, #txtMoTa, #txtYeuCau, #DropCoSo, #DropChucVu, #txtSoLuong, #txtMucLuongTu, #txtMucLuongDen, #txtLinkTuyenDung, #txtNgayBatDau, #txtHanNopHoSo, #txtNgayKetThuc',
    session: '', 
    type: '',
    TuyenDungId: '',
    TT_HoSoNS: '',
    tkC3: '',
    getDataCoSoId: '',
    getDataPhongBanId: '', 
    getDataChucVuId: '', 
    currentRowData: null, 
    flagTinhTrang: false,

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
                if (me.flagTinhTrang) {
                    $('#DropPhongBan').prop('disabled', true);
                } else {
                    $('#DropPhongBan').prop('disabled', false);
                } 
                 
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
        $("#btnDuyet").click(function (e) {
            if ($("#DropTinhTrang_DuyetHSTD").val() == 4) {
                me.jsValid_Duyet += ', #txtGhiChu_Duyet';
            }
            if (me.currentRowData) {
                var valid = Core.validateRequiredFields(me.jsValid_Duyet);
                if (valid == true) {
                    me.update_trangthaiHSTD_xetduyet(me.currentRowData.id, me.currentRowData.tinhtrangHSTD, me.currentRowData.hoten, me.currentRowData.email);
                }
                else {
                    Core.showToast('Vui lòng không bỏ trống ô nhập liệu!', 'warning');
                }
            } else {
                Core.showToast('Không tìm thấy thông tin dòng được chọn!', 'error');
            }
        }); 

        $(document).delegate('.action-icon', 'click', function () { 
            var id = this.id;
            var type = this.type;
            var tinhtrangHSTD = $(this).attr('tinhtrangHSTD'); 
            var hoten = $(this).attr('hoten'); 
            var email = $(this).attr('email'); 
            if (id == '' || id == undefined || id == null) return;
            switch (type) {
                case 'edit': 
                    window.open('/NhanSu/DetailNhanSuView?id=' + id + '&type=HSTD', '_self');
                    break;
                case 'noAction':
                    Core.showToast('Bạn không thể sử dụng tính năng này!', 'warning');
                    break;
                case 'Duyet': 
                    me.currentRowData = {
                        id: id,
                        tinhtrangHSTD: tinhtrangHSTD,
                        hoten: hoten,
                        email: email 
                    };
                    $("#staticBackdrop_duyetHSTD").modal('show');

                    break;
                case 'delete':
                    Core.showModal_Confirm('Thông báo', 'Bạn có chắc chắn muốn xóa hồ sơ ứng viên?');
                    $("#btnYes").click(function (e) {
                        $('#modalconfirm').modal('hide');
                        me.delete_UngVien(id);
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
        var hidecol = true; 
        if (me.roleId == 3 && me.tkC3 != 'NHANSU') {
            hidecol = false;
        } else if (me.roleId == 4) {
            hidecol = false;
        }
        var jsonData = {
            Keyword: '',
            tbl_CompanyId: me.CongTyId, 
            tbl_CoSoId: me.getDataCoSoId, 
            tbl_PhongBanId: me.getDataPhongBanId,
            tbl_Category_ChucVuId: me.getDataChucVuId, 
            tbl_TuyenDungId: me.Id, 
            TinhTrang:  -1,
            StatusId: 1,
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
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11]
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
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        if (row.TinhTrangHoSoTD == 4) {
                            return '<a title="Đã duyệt, không thể tác động" id="' + data + '"  type="noAction"  tinhtrangHSTD="' + row.TinhTrangHoSoTD + '"  class="action-icon text-secondary" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        } else {
                            return '<a title="Duyệt ứng viên" id="' + row.Id + '" type="Duyet" tinhtrangHSTD="' + row.TinhTrangHoSoTD + '" email="' + row.Email + '" hoten="' + row.HoTen + '" class="action-icon text-success btnDuyet" href="javascript:void(0);"><i class="bi bi-check-circle"></i></a>';
                        }
                    },
                    "visible": hidecol
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        if ((row.TinhTrangHoSoTD != 1) || (me.roleId == 3 && me.tkC3 != 'NHANSU')) {
                            return '<a title="Xem" id="' + row.Id + '" type="edit" tinhtrangHSTD="' + row.TinhTrangHoSoTD + '"  class="action-icon text-success btnSua" href="javascript:void(0);"><i class="bi bi-eye"></i></a>';
                        } else {
                            return '<a title="Chỉnh sửa" id="' + row.Id + '" type="edit" tinhtrangHSTD="' + row.TinhTrangHoSoTD + '"  class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                        } 
                    },
                    /*"visible": !(me.roleId == 3 && me.tkC3 != 'NHANSU')*/
                }
                ,
                {
                    "data": null,
                    "render": function (data, type, row) { 
                        if (row.TinhTrangHoSoTD != 1) {
                            return '<a title="Đã duyệt, không thể tác động" id="' + data + '"  type="noAction" tinhtrangHSTD="' + row.TinhTrangHoSoTD + '" class="action-icon text-secondary" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        } else {
                            return '<a title="Xóa dữ liệu" id="' + row.Id + '" type="delete" class="action-icon text-success btnXoa" tinhtrangHSTD="' + row.TinhTrangHoSoTD + '"  href="javascript:void(0);"><i class="bi bi-trash3"></i></a>';
                        }
                    }, 
                    "visible": hidecol
                    
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

                        me.flagTinhTrang = obj.TinhTrang != 1; 

                        if (obj.TinhTrang == 2 && me.type != 'copy') {
                            $("#line_chiaDong").prop('hidden', false);
                            $("#zone_lstTuyenDung").prop('hidden', false); 
                            me.filter_lst_UngVien(); 
                            $(".form-control, .custom-textarea, .form-custom").prop("disabled", true);
                            $('#btnSave_T').prop('hidden', true);
                            $('#btnReset_T').prop('hidden', true);
                            $('#DropPhongBan').prop('disabled', true);
                            $('#txtGhiChu_Duyet').prop('disabled', false);
                            $('#DropTinhTrang_DuyetHSTD').prop('disabled', false);
                        }
                        if (obj.TinhTrang == 3 && me.type != 'copy') {
                            $("#btnSave_T").hide();
                            $("#btnReset_T").hide();
                            $("#btnThemMoi_T").hide();
                            $("#btnThemMoi_NS").hide();
                            $("#btnXoa_T").hide();
                            $(".form-control, .custom-textarea, .form-custom").prop("disabled", true);
                            $("#line_chiaDong").prop('hidden', false);
                            $("#zone_lstTuyenDung").prop('hidden', false); 
                            me.filter_lst_UngVien(); 
                        }
                        if (obj.TinhTrang == 4 && me.type != 'copy') {
                            $("#btnSave_T").hide();
                            $("#btnReset_T").hide();
                            $("#btnThemMoi_NS").hide();
                            $("#line_chiaDong").prop('hidden', false);
                            $("#zone_lstTuyenDung").prop('hidden', false);
                            me.filter_lst_UngVien(); 

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
    delete_UngVien: function (id) {
        var me = this;
        var jsonData =
        {
            'id': id 
        };
        Core.startButtonLoading("btnRecycleBin");
        $.ajax({
            type: 'POST',
            url: '/NhanSu/DeleteNhanSu',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filter_lst_UngVien(); 
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

    update_trangthaiHSTD_xetduyet: function (id, trangthaiHSTD, hoten, email) {
        var me = this; 
        var jsonData =
        {
            'tbl_NhanSuId': id,
            'HoTenNguoiDuyet': Core.userName,
            'tbl_Category_ChucVuId': Core.tkchucvuId,
            'TinhTrangHSTD_TruocDuyet': trangthaiHSTD,
            'TinhTrangHSTD_SauDuyet': $("#DropTinhTrang_DuyetHSTD").val(),
            'Note': $("#txtGhiChu_Duyet").val() 
        };
        Core.startButtonLoading("btnSave");
        $.ajax({
            type: 'POST',
            url: '/TuyenDung/TuyenDung_UpdateTinhTrangHSTD',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    $("#staticBackdrop_duyetHSTD").modal('hide'); 
                    me.filter_lst_UngVien();
                    if ($("#DropTinhTrang_DuyetHSTD").val() == 4) {
                        Core.showModal_Confirm(
                            'Thông báo',
                            'Bạn có muốn tạo tài khoản cho nhân sự này hay không? </br> Tài khoản của nhân sự sau khi tạo mới thành công là:</br> Email:<span class="text-primary"> ' + email + '</span></br> Mật khẩu: <span class="text-primary">Abcdef1234.</span> </br> <em><span class="text-primary">Lưu ý lưu lại thông tin tài khoản trước khi lưu.Tài khoản chỉ sử dụng được sau khi hồ sơ nhân sự được cấp trên xét duyệt!</span></em>'
                        );
                        $("#btnYes").click(function (e) {
                            $('#modalconfirm').modal('hide');
                            me.add_account(hoten, email);
                        });
                    }
                } else {
                    Core.showToast(response.Message, 'danger');
                }
                Core.stopButtonLoading('btnSave');
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
        });
    },

    add_account: function (hoten, email) {
        var me = this;  
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
            'Name': hoten, 
            'RoleId': role,
            'Password': 'Abcdef1234.',
            'Gmail': email,
            'CompanyId': Core.companyId,
            'CoSoId': tbl_CoSoId ? tbl_CoSoId || '' : Core.tkcosoId || '',
            'PhongBanId': tbl_PhongBanId || '',
            'C3': (definePhongBan === 'D0D7A8A7-9452-4470-81A6-ADDC2A9FB73C' || !definePhongBan) ? 'NHANSU' : '-1', // dùng tạm
            'ChucVuId': tbl_Category_ChucVuId,
            'StatusId': 2,
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
        //if (me.Id && !me.type) { 
        //}
        if ((me.roleId == 4) && (me.type != 'HSTD')) { 
            $("#btnSave_T").hide();
            $("#btnReset_T").hide();
            $("#btnThemMoi_T").hide();
            $("#btnXoa_T").hide();
        }
        if ((me.roleId == 3 && me.tkC3 != 'NHANSU') || me.roleId == 4 && me.tkC3 != 'NHANSU') {
            $("#z_button").hide();
            $("#col_Duyet").hide(); 
            $("#col_Xoa").hide();
            $("#btnThemMoi_NS").hide();

        }
    }, 
}; 