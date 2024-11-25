function ListNhanSu() { } 
ListNhanSu.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    tkcosoId: '',
    tkphongbanId: '',
    userName: '',
    tkC3: '',
    nhansuId: '',
    RecoverMode: false,
    jsValid: '#DropTinhTrang_Duyet', 
    jsValidThayDoi: '#txtGhiChuChuyen, #DropNhanSuChuyen, #DropChucVuChuyen, #DropCoSoChuyen', 
    jsValidYC: '#txtYeuCau, #txtSoLuongYC, #txtNgayHoanTatYC, #txtMoTaYC, #txtYeuCauYC, #DropChucVuYC, #DropPhongBanYC, #DropCoSoYC',
    session: {},

    StatusCode: Object.freeze({
        Actived: 1, 
        Deleted: 2,
    }),
    init: function () {
        this.init_data();
        this.init_event();
        this.init_action();
    },

    init_data: function () {
        var me = this; 
        me.roleId = Core.roleId; 
        me.CongTyId = Core.companyId;
        me.tkcosoId = Core.tkcosoId;
        me.tkphongbanId = Core.tkphongbanId;
        me.nhansuId = Core.tknhansuId;
        me.tkC3 = Core.tkC3;
        if (me.roleId == 99) {
            $('#zone_CoSo').prop('hidden', false);
            $('#zone_company').prop('hidden', false);
            $("#btnBoSung_NhanSu").hide(); 
        } else if (me.roleId == 1) {
            $('#zone_CoSo').prop('hidden', false);
            $('#zone_ChucVu').appendTo('#first_row');
            $("#btnBoSung_NhanSu").hide(); 
        } else if (me.roleId == 2) {
            $('#zone_ChucVu').appendTo('#first_row');
            $("#btnBoSung_NhanSu").hide();
            $('#zone_QueQuan').appendTo('#first_row');
            $("#DropCoSoChuyen").prop('disabled', true); 
        } else if (me.roleId == 3) {
            $('#zone_PhongBan').prop('hidden', true);
            $('#zone_ChucVu').appendTo('#first_row');
            $('#zone_QueQuan').appendTo('#first_row');
            $('#zone_TinhTrang').appendTo('#first_row');
        } 

        if (me.roleId == 3 && me.tkC3 != 'NHANSU') {
            $("#btnDieuChuyen").hide();
            $("#btnThemMoi").hide();
            $("#btnXetDuyet_HSNS").hide();
            $("#btnRecycleBin").hide();
            $("#col_NB").hide();
            $("#col_Xoa").hide();
            $("#chkSelectAll").hide();
            $("#col_Sua").html("Xem");
        } else if (me.roleId == 3 && me.tkC3 == 'NHANSU') {
            $("#btnDieuChuyen").hide();
            $("#btnXetDuyet_HSNS").hide();
            $('#zone_PhongBan').prop('hidden', false);
            $('#zone_TinhTrang').appendTo('#row_hidden');
        }
        Core.loadDrop_Company('searchDropCongTy', 'Chọn công ty', '');
        Core.loadDrop_CoSo('searchDropCoSo', 'Chọn công ty', '');
        Core.loadDrop_CoSo('editDropCoSo', 'Chọn công ty', '');
        Core.loadDrop_CoSo('DropCoSoYC', 'Chọn công ty', '');
        Core.loadDrop_CoSo('DropCoSoChuyen', 'Chọn công ty', '');
        Core.loadDrop_PhongBan('searchDropPhongBan', 'Chọn phòng ban', '');
        Core.loadDrop_PhongBan('DropPhongBanChuyen', 'Chọn phòng ban', '');
        Core.loadDrop_PhongBan('DropPhongBanYC', 'Chọn phòng ban', '');
        var coSo;
        (me.roleId == 1) ? (coSo = '') : (coSo = me.tkcosoId);
        console.log(me.roleId, coSo)
        Core.loadDrop_NhanSu('DropNhanSuChuyen', 'Chọn nhân sự', '', coSo, '');
        if ((me.roleId != 1) || (me.roleId != 99)) {
            me.loadDrop_Category_ChucVu('searchDropChucVu', 'Chọn chức vụ', '', 'DMCV', 9);
            me.loadDrop_Category_ChucVu('DropChucVuYC', 'Chọn chức vụ', '', 'DMCV', 9);
            me.loadDrop_Category_ChucVu('DropChucVuChuyen', 'Chọn chức vụ', '', 'DMCV', 9);
        } else {
            Core.loadDrop_Category('searchDropChucVu', 'Chọn chức vụ', '', 'DMCV', 9);
            Core.loadDrop_Category('DropChucVuChuyen', 'Chọn chức vụ', '', 'DMCV', 9);
        }
        Core.loadDrop_DiaChi('searchDropQueQuan', 'Tinh', '');
        this.filterNhanSu();
    },
    init_event: function () {
        var me = this;
         
        $("#btnTimKiem").on("click", function () {
            me.filterNhanSu();
        });
        $("#btnHuyTimKiem").on("click", function () {
            me.resetSearch();
        }); 
        $("#btnDieuChuyen").on("click", function () {
            $("#staticBackdrop_DieuChuyen").modal('show');
        }); 
        $("#btnThemMoi").on("click", function () {
            window.open('/NhanSu/DetailNhanSuView', '_blank');
        }); 
        $("#btnAnDieuKien").click(function (e) {
            if ($("#dieukientimkiem").is(":visible")) {
                $("#dieukientimkiem").hide(500);
                $("#btnAnDieuKien").html(
                    '<i class="fa-solid fa-arrow-down-wide-short"></i> Hiển thị thêm'
                );
            } else {
                $("#dieukientimkiem").show(500);
                $("#btnAnDieuKien").html(
                    '<i class="fa-solid fa-arrow-up-wide-short"></i> Thu nhỏ'
                );
            }
        });
        $("#btnBoSung_NhanSu").click(function (e) {
            e.preventDefault();
            if (me.roleId == 3 && me.tkC3 != 'NHANSU') { 
                $("#DropCoSoYC").val(me.tkcosoId).trigger('change'); 
                $("#DropPhongBanYC").val(me.tkphongbanId).trigger('change');  
                $("#staticBackdrop_BoSungNS").modal('show');
            } else if (me.roleId == 3 && me.tkC3 == 'NHANSU') {
                window.open('/TuyenDung/DetailTuyenDungView', '_self');
            }
        }); 
        $("#btnXetDuyet_HSNS").click(function (e) {
            e.preventDefault();
            let items = '';
            $('[id$=tbldata]').find(":checkbox[id^='category']:checked").each(function () {
                items += this.id + ',';
            });
            if (items == '' || items.length <= 0) {
                Core.showToast('Bạn chưa chọn dữ liệu nào!', 'warning');
                return;
            } else {
                $("#staticBackdrop").modal('show');
            }
        }); 
        $("#btnSave").click(function (e) {
            e.preventDefault();
            let items = '';
            $('[id$=tbldata]').find(":checkbox[id^='category']:checked").each(function () {
                items += this.id + ',';
            });
            items = items.replace(/category/g, "");
            items = items.substring(0, items.lastIndexOf(",")); 
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.update_trangthai_xetduyet(items);
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
            
        });
        $("#btnYeuCau").click(function (e) {
            e.preventDefault(); 
            var valid = Core.validateRequiredFields(me.jsValidYC);
            if (valid == true) {
                me.ThemMoi_YCTuyenDung();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
            
        });
        $("#btnThayDoi").click(function (e) {
            e.preventDefault(); 
            var valid = Core.validateRequiredFields(me.jsValidThayDoi);
            if (valid == true) {
                me.DieuChuyen_ThayDoiNS();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
            
        });
        $(document).delegate('.action-icon', 'click', function () {
            var id = this.id;
            var type = this.type;
            var tinhTrang = $(this).attr('tinhtrang'); 

            if (id == '' || id == undefined || id == null) return;
             
            if (tinhTrang == 0 && (type === 'edit' || type === 'copy')) {
                window.open('/NhanSu/DetailNhanSuView?id=' + id + (type === 'copy' ? '&type=copy' : '') + '&type=noHSTD', '_blank');
                return;
            } 
            if (tinhTrang == 0 && (type === 'delete' || type === 'recover')) {
                if (type === 'delete') {
                    Core.showToast('Không thể xóa nhân sự đang trong quá trình tuyển dụng!', 'warning'); 
                } else {
                    Core.showToast('Không thể khôi phục nhân sự đang trong quá trình tuyển dụng!', 'warning');
                }
                return;
            }
             
            switch (type) {
                case 'edit':
                    me.Id = id;
                    window.open('/NhanSu/DetailNhanSuView?id=' + id, '_blank');
                    break;
                case 'delete':
                    Core.showModal_Confirm('Thông báo', 'Bạn có chắc chắn muốn xóa vào thùng rác?');
                    $("#btnYes").click(function (e) {
                        $('#modalconfirm').modal('hide');
                        me.update_capnhat_trangThai(id, me.StatusCode.Deleted);
                    });
                    break;
                case 'copy':
                    me.Id = id;
                    window.open('/NhanSu/DetailNhanSuView?id=' + id + '&type=copy', '_blank');
                    break;
                case 'noAction': 
                    Core.showToast('Bạn không thể sử dụng tính năng này!', 'warning');
                    break;
                case 'recover':
                    me.update_capnhat_trangThai(id, me.StatusCode.Actived);
                    break;
            }
        });
        $("#btnRecycleBin").click(function (e) {
            e.preventDefault();
            let items = '';
            $('[id$=tbldata]').find(":checkbox[id^='category']:checked").each(function () {
                items += this.id + ',';
            });
            if (items == '' || items.length <= 0) {
                Core.showToast('Bạn chưa chọn dữ liệu nào!', 'warning');
                return;
            }

            items = items.replace(/category/g, "");
            items = items.substring(0, items.lastIndexOf(","));

            if (me.RecoverMode) {
                $('#modalconfirm').modal('hide');
                me.update_capnhat_trangThai(items, me.StatusCode.Actived);
                $('#chkSelectAll').prop('checked', false);
            }
            else {
                Core.showModal_Confirm('Thông báo', 'Bạn có chắc chắn muốn xóa vào thùng rác?');
                $("#btnYes").click(function (e) {
                    $('#modalconfirm').modal('hide');
                    me.update_capnhat_trangThai(items, me.StatusCode.Deleted);
                    $('#chkSelectAll').prop('checked', false);
                });
            }
            Core.stopButtonLoading("btnRecycleBin"); 
        });
        $('[id$=chkSelectAll]').on('click', function () {
            var checked_status = $(this).is(':checked');
            var listData = $('[id$="tbldata"]');
            listData.find('input:checkbox').each(function () {
                $(this).attr('checked', checked_status);
                $(this).prop('checked', checked_status);
            });
        });   

        $('#DropChucVuChuyen').on('change', function () {
            var selectedValue = $(this).val();
            var selectedName = $(this).find("option:selected").attr("name");

            if (selectedName === 'PTGD') {
                $('#row_phongban, #row_coso').prop('hidden', true);
                $("#DropPhongBanChuyen").val('').trigger('change');
                $("#DropCoSoChuyen").val('').trigger('change');

            } else if (selectedName === 'GD' || selectedName === 'PGD') {
                $('#row_phongban').prop('hidden', true);
                $('#row_coso').prop('hidden', false);
                $("#DropPhongBanChuyen").val('').trigger('change');
            } else {
                $("#DropCoSoChuyen").val(me.tkcosoId).trigger('change');
                $('#row_phongban, #row_coso').prop('hidden', false);
            }
            role = $("#DropChucVuChuyen").find("option:selected").attr("name");

            console.log(selectedValue, selectedName, role);
        });
    },
    init_action: function () {
        var me = this;
    }, 


    /*CRUD*/
    filterNhanSu: function () {
        var me = this;
        if ($("#DropTrangThai").val() != 1) {
            $('#btnRecycleBin').html('<i class="fa-solid fa-rotate-right me-1"></i> Khôi phục');  
            $('#lbXoa').html('KP');
            me.RecoverMode = true;
        } else {
            $('#btnRecycleBin').html('<i class="fa-solid fa-trash-can me-1"></i> Thùng rác'); 
            $('#lbXoa').html('Xóa');
            me.RecoverMode = false;
        }; 
        let phongban;
        if ((me.roleId == 1) || (me.roleId == 99) || (me.roleId == 2)) {
            phongban = $("#searchDropPhongBan").val();
        } else {
            if ((me.roleId == 3) && (me.tkC3 == 'NHANSU')) {
                phongban = $("#searchDropPhongBan").val();
            } else {
                phongban = me.tkphongbanId;
            }
        }
        var jsonData = {  
            Keyword: $("#searchTuKhoa").val() || '',
            tbl_CompanyId: (me.roleId == 99) ? $("#searchDropCongTy").val() : me.CongTyId, 
            tbl_CoSoId: ((me.roleId == 1) || (me.roleId == 99)) ? $("#searchDropCoSo").val() : me.tkcosoId, 
            tbl_PhongBanId: phongban, 
            tbl_Category_ChucVuId:  $("#searchDropChucVu").val() || '', 
            tblCategory_Que_TinhId: ((me.roleId == 1) || (me.roleId == 99)) ? $("#searchDropQueQuan").val() : '',
            RoleId: me.roleId == 99 ? 0 : me.roleId,
            TinhTrang: $("#DropTinhTrang_search").val() || -1,
            StatusId: $("#DropTrangThai").val() || -1,
        };

        // Tách cấu hình DataTables
        var dtConfig = {
            "paging": true,
            "pageLength": 25,
            "lengthChange": true,
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
                'aTargets': [8, 9, 10 ,11]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            }
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "MaNhanVien", "className": "text-center" },
                { "data": "HoTen", "className": "text-center" },
                { "data": "NgaySinh" },
                { "data": "TenPB", "className": "text-center" },
                { "data": "ChucVuName", "className": "text-center" },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrang) {
                            case 0:
                                badgeClass = 'badge rounded-pill border border-info text-info fs-7';
                                badgeText = 'Trong quá trình tuyển dụng';
                                break;
                            case 1:
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';
                                badgeText = 'Khởi tạo (chờ xét duyệt)';
                                break;
                            case 2:
                                badgeClass = 'badge rounded-pill border border-success text-success fs-7';
                                badgeText = 'Hoạt động (đang làm việc)';
                                break;
                            case 3:
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';
                                badgeText = 'Từ chối duyệt (nghỉ việc)';
                                break;
                            default:
                                badgeClass = 'badge rounded-pill border border-warning text-warning fs-7';
                                badgeText = 'Không xác định';
                        }

                        return `<h4><span title="Tình trạng của cơ sở" class="${badgeClass}">${badgeText}</span></h4>`;
                    }
                },
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        var dropdown = '<a title="Sao chép" id="' + row.Id + '" type="copy" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnNhanBan" href="javascript:void(0);"><i class="fa-regular fa-copy"></i></a>';
                        return dropdown;
                    },
                    "visible": !(me.roleId == 3 && me.tkC3 != 'NHANSU')  
                }
                ,
                {
                    "mData": null,
                    "mRender": function (data, type, row) {
                        if (((me.roleId == 3) && (row.TinhTrang == 2) && (me.tkC3 == 'NHANSU')) || ((me.roleId == 2) && (row.TinhTrang == 2) && ((row.tbl_Category_ChucVuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') || (row.tbl_Category_ChucVuId == '6E605817-1A12-46C9-A7E6-58F49AC9C3CF')))){ //((!row.tbl_PhongBanId) && (row.Id != me.nhansuId) && (me.roleId == 2)) || ((me.roleId == 3) && (!row.tbl_PhongBanId))
                            return '<a title="Chỉnh sửa" id="' + row.Id + '" type="noAction" class="action-icon text-muted" tinhtrang="' + row.TinhTrang + '" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                        } else {
                            if (me.roleId == 3 && me.tkC3 != 'NHANSU') {
                                return '<a title="Xem" id="' + row.Id + '" type="edit" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="bi bi-eye"></i></a>';
                            } else { 
                                return '<a title="Chỉnh sửa" id="' + row.Id + '" type="edit" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                            }
                        }
                    }
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        if (((me.roleId == 3) && (row.TinhTrang != 1)) || ((me.roleId == 2) && (row.TinhTrang == 0)) || ((me.roleId == 2) && (row.TinhTrang != 1) && ((row.tbl_Category_ChucVuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') || (row.tbl_Category_ChucVuId == '6E605817-1A12-46C9-A7E6-58F49AC9C3CF')))) {
                            if (!me.RecoverMode) {
                                return '<a title="Xóa dữ liệu" id="' + data + '" tinhtrang="' + row.TinhTrang + '" class="action-icon text-muted " type="noAction" href="javascript:void(0);" ><i class="fa-solid fa-trash"></i></a>';
                            }
                            else {
                                return '<a title="Khôi phục dữ liệu" id="' + data + '"  tinhtrang="' + row.TinhTrang + '" class="action-icon text-muted" type="noAction" href="javascript:void(0);  ><i class="fa-solid fa-rotate-right"></i></a>';
                            } 
                        } else {
                            if (!me.RecoverMode) {
                                return '<a title="Xóa dữ liệu" id="' + data + '" type="delete" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnXoa" href="javascript:void(0);"><i class="fa-solid fa-trash"></i></a>';
                            }
                            else {
                                return '<a title="Khôi phục dữ liệu" id="' + data + '" type="recover" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnKhoiPhuc" href="javascript:void(0);"><i class="fa-solid fa-rotate-right"></i></a>';
                            } 
                        } 
                    },
                    "visible": !(me.roleId == 3 && me.tkC3 != 'NHANSU') 
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        if (((me.roleId == 3) && (row.TinhTrang != 1)) || (row.TinhTrang == 0) || ((me.roleId == 2) && ((row.tbl_Category_ChucVuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') || (row.tbl_Category_ChucVuId == '6E605817-1A12-46C9-A7E6-58F49AC9C3CF')))) {
                            return '<a title="Nhân sự đã duyệt, không thể tác động" id="' + data + '"  type="noAction" tinhtrang="' + row.TinhTrang + '" class="action-icon text-secondary" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        } else { 
                            return '<input type="checkbox" class="form-check-input" tinhtrang="' + row.TinhTrang + '" id="category' + row.Id + '" name="category' + row.Id + '" data-trang-thai="' + row.TinhTrang + '">';
                        } 
                    }, 
                    "className": "text-center",
                    "visible": !(me.roleId == 3 && me.tkC3 != 'NHANSU')
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
    save: function (action) {
        var me = this;
        let TenPhongBan = $("#txTenPB").val();
        let MaPhongBan = $("#txMaPB").val() + '-';
        let tbl_CoSoId = $("#editDropCoSo").val();
        let GhiChu = $("#txtGhiChu").val();
        let TinhTrang = $("#DropTinhTrang").val();


        let jsonData = {
            'TenPhongBan': TenPhongBan,
            'MaPhongBan': MaPhongBan,
            'tbl_CompanyId': me.CongTyId,   
            'tbl_CoSoId': tbl_CoSoId,
            'Note': GhiChu,
            'CreatedBy': Core.userName,
            'TinhTrang': TinhTrang || 1,
            'StatusId': me.StatusId_Edit,
            'Id': me.Id,
        };
         
        if (action == 0) {
            Core.startButtonLoading("btnSave");
        } else {
            Core.startButtonLoading("btnSaveAndNew");
        }
         
        $.ajax({
            type: 'POST',
            url: '/PhongBan/Save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    me.resetSearch();
                    me.filterNhanSu();
                    if (action == 1) {
                        $("#myModalLabel").html("Thêm cơ sở");
                        me.resetPopup();
                    }
                    else {
                        $('#staticBackdrop').modal('hide');
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
                if (action == 0) {
                    Core.stopButtonLoading("btnSave");
                } else {
                    Core.stopButtonLoading("btnSaveAndNew");
                }
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
            url: '/PhongBan/GetPhongBanById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                        $("#txTenPB").val(obj.TenPhongBan);
                        $("#txMaPB").val(obj.MaPhongBan);
                        $("#editDropCoSo").val(obj.tbl_CoSoId).trigger('change'); 
                        $("#txtGhiChu").val(obj.Note);
                        $("#DropTinhTrang").val(obj.TinhTrang);
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
            url: '/NhanSu/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filterNhanSu(); 
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

    update_trangthai_xetduyet: function (str_Id) {
        var me = this;
        var jsonData =
        {
            'C1': str_Id,
            'Note': $("#txtGhiChu").val(),
            'TinhTrang': $("#DropTinhTrang_Duyet").val(),
            'ModifyBy': Core.userName,
        };
        Core.startButtonLoading("btnSave");
        $.ajax({
            type: 'POST',
            url: '/NhanSu/UpdateTinhTrangNS',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    $("#staticBackdrop").modal('hide');
                    $("#chkSelectAll").prop('checked', false);
                    me.filterNhanSu();
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
    /*Utility*/
    resetSearch: function () {
        $("#searchTuKhoa").val(''); 
        $("#searchDropCongTy").val('').trigger('change');
        $("#searchDropCoSo").val('').trigger('change');
        $("#searchDropPhongBan").val('').trigger('change');
        $("#searchDropChucVu").val('').trigger('change');
        $("#searchDropQueQuan").val('').trigger('change'); 
        $("#DropTinhTrang_search").val('').trigger('change'); 
        $("#DropTrangThai").val('1').trigger('change');
        $("#chkSelectAll").prop('checked', false);
        this.filterNhanSu();
    }, 
     
    loadDrop_Category_ChucVu: function (zone_id, strTitle, defaultValue, loaiDM, dmCha) {
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
                    var tbCombo = $('[id$=' + zone_id + ']');
                    tbCombo.html('');

                    // Lọc danh sách dựa trên điều kiện RoleId
                    var filteredList;
                    if (me.roleId == 99) {
                        // Nếu me.roleId = 99, trả về tất cả các phần tử
                        filteredList = json;
                    } else {
                        // Nếu me.roleId khác 99, lọc theo điều kiện RoleId
                        filteredList = json.filter(function (item) {
                            return item.RoleId >= me.roleId &&
                                (me.roleId == 1 || item.RoleId != 1);
                        });
                    }

                    if (filteredList.length > 0) {
                        var getList = "";

                        // Tạo tiêu đề mặc định nếu có
                        if (!strTitle) {
                            strTitle = "-- Chọn dữ liệu --";
                        } else {
                            strTitle = "--- " + strTitle + " ---";
                        }
                        getList += "<option value=''>" + strTitle + "</option>";

                        // Tạo các tùy chọn dựa trên danh sách đã lọc
                        filteredList.forEach(function (item) {
                            getList += "<option name='" + item.Name + "' role='" + item.RoleId + "' value='" + item.Id + "'>" + item.MoTa + "</option>";
                        });

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
     
    ThemMoi_YCTuyenDung: function () {
        var me = this;    

        let MaTuyenDung = '';
        let TenTuyenDung = $('#txtYeuCau').val();
        let MoTa = $('#txtMoTaYC').val();
        let YeuCau = $('#txtYeuCauYC').val();
        let tbl_CoSoId = $('#DropCoSoYC').val();
        let tbl_PhongBanId = $('#DropPhongBanYC').val();
        let tbl_Category_ChucVuId = $('#DropChucVuYC').val();
        let SoLuong = $('#txtSoLuongYC').val(); 
        let NgayKetThuc = $('#txtNgayHoanTatYC').val(); 
         
         
        let jsonData = {
            'MaTuyenDung': MaTuyenDung,
            'TenTuyenDung': TenTuyenDung,
            'MoTa': MoTa,
            'YeuCau': YeuCau,
            'tbl_CoSoId': tbl_CoSoId,
            'tbl_PhongBanId': tbl_PhongBanId,
            'tbl_Category_ChucVuId': tbl_Category_ChucVuId,
            'SoLuong': SoLuong, 
            'NgayKetThuc': NgayKetThuc,
            'tbl_CompanyId': me.CongTyId,
            'CreatedBy': Core.userName,
            'TinhTrang': 1,
            'StatusId': 1,
            'Id': '' 
        };


        Core.startButtonLoading("btnYeuCau");

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
                Core.stopButtonLoading("btnYeuCau");
            }
        });
    },



    DieuChuyen_ThayDoiNS: function (str_Id, statusId) {
                

        var me = this;
        var Note = $('#txtGhiChuChuyen').val();
        var tbl_NhanSuId = $('#DropNhanSuChuyen').val(); 
        var chucuVal = $('#DropChucVuChuyen').val(); 
        var phongbanVal = $('#DropPhongBanChuyen').val(); 
        var cosoVal = $('#DropCoSoChuyen').val(); 

        var role;
        let valName = $("#DropChucVuChuyen").find("option:selected").attr("name");
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
            'tbl_NhanSuId': tbl_NhanSuId,
            'HoTenNguoiThayDoi': Core.userName, 
            'tbl_Category_ChucVuId': chucuVal,
            'tbl_PhongBanId': phongbanVal,
            'tbl_CoSoId': cosoVal,
            'tbl_Category_ChucVuNguoiThayDoiId': Core.tkchucvuId,
            'Note': Note, 
            'C3': (phongbanVal === 'D0D7A8A7-9452-4470-81A6-ADDC2A9FB73C' || !phongbanVal) ? 'NHANSU' : '-1',
            'RoleId': role,
            'checkTD': 1,
        };
        Core.startButtonLoading("btnThayDoi");
        $.ajax({
            type: 'POST',
            url: '/NhanSu/LichSu_ThayDoi_Insert',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $("#staticBackdrop_DieuChuyen").modal('hide');
                } else {
                    Core.showToast(response.Message, 'danger');
                }
                Core.stopButtonLoading('btnThayDoi');
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
        });
    },
}; 