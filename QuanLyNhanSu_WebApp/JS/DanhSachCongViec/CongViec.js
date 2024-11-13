function CongViec() { } 
CongViec.prototype = {
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
    jsValidYC: '#txtTenCongViec, #txtNgayBatDau, #txtNgayKetThuc, #editDropTinhTrang, #editDropMucDo, #txtMoTa, #txtLinkThucHien, #Drop_tbl_NhanSuId', 
    StatusCode: Object.freeze({
        Actived: 1, 
        Deleted: 2,
    }),
    init: function () {
        this.init_data();
        this.init_event(); 
    },

    init_data: function () {
        var me = this; 
        me.roleId = Core.roleId; 
        me.CongTyId = Core.companyId;
        me.tkcosoId = Core.tkcosoId;
        me.tkphongbanId = Core.tkphongbanId;
        me.nhansuId = Core.nhansuId;
        me.tkC3 = Core.tkC3;
        me.hiddenShowByRoleId();
         
        Core.loadDrop_Company('searchDropCongTy', 'Chọn công ty', '');
        Core.loadDrop_Company('Drop_tbl_CompanyId', 'Chọn công ty', '');
        Core.loadDrop_CoSo('searchDropCoSo', 'Chọn cơ sở', '');   
        Core.loadDrop_CoSo('Drop_tbl_CoSoId', 'Chọn cơ sở', '');   
        Core.loadDrop_PhongBan('searchDropPhongBan', 'Chọn phòng ban', ''); 
        Core.loadDrop_PhongBan('Drop_tbl_PhongBanId', 'Chọn phòng ban', ''); 
        if ((me.roleId != 1) || (me.roleId != 99)) {
            Core.loadDrop_Category_ChucVu('searchDropChucVu', 'Chọn chức vụ', '', 'DMCV', 9); 
        } else {
            Core.loadDrop_Category('searchDropChucVu', 'Chọn chức vụ', '', 'DMCV', 9);
        } 
        this.filterCongViec();
    },
    init_event: function () {
        var me = this;
         
        $("#btnTimKiem").on("click", function () {
            me.filterCongViec();
        });
        $("#btnHuyTimKiem").on("click", function () {
            me.resetSearch();
        });  
        $("#btnMyCV").on("click", function () {
            me.filterCongViec('biến chỉ để nhận biết lấy công việc của cá nhân');
        });  
        $("#btnThemMoi").on("click", function () {
            me.resetEdit();
            $("#staticBackdrop").modal('show');
        }); 
        $("#btnSave").click(function (e) {
            e.preventDefault();
            if (me.roleId == 4){
                $("#Drop_tbl_NhanSuId").val(Core.exportValueUrl('id')).trigger('change');
            } 
            var valid = Core.validateRequiredFields(me.jsValidYC);
            if (valid == true) {
                me.save(0);
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $("#btnSaveAndNew").click(function (e) {
            e.preventDefault();
            var valid = Core.validateRequiredFields(me.jsValidYC);
            if (valid == true) {
                me.save(1);
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
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
        $(document).delegate('.action-icon', 'click', function () {
            var id = this.id;
            var type = this.type;
            var tinhTrang = $(this).attr('tinhtrang'); 
             
            switch (type) {
                case 'edit':
                    me.Id = id;
                    me.getDataById(id);
                    $("#staticBackdrop").modal('show');
                    $("#myModalLabel").html("Chi tiết công việc");
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
                    me.getDataById(id);
                    $("#staticBackdrop").modal('show');
                    $('#txtMaCongViec').val('').prop('disabled', true); 
                    $("#myModalLabel").html("Sao chép thông tin");
                    me.Id = "";
                    me.StatusId_Edit = me.StatusCode.Actived;
                    break;
                case 'noAction': 
                    Core.showToast('Dữ liệu do cấp trên tạo. Bạn không thể sử dụng tính năng này!', 'warning');
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
        $('#Drop_tbl_CompanyId').on('change', function () {
            let selectedValue = $(this).val();
            me.loadDrop_CoSo('Drop_tbl_CoSoId', 'Chọn cơ sở', '', selectedValue)
        });
        $('#Drop_tbl_CoSoId').on('change', function () {
            let selectedValue = $(this).val();
            let congtyy = $('#Drop_tbl_CompanyId').val();
            me.loadDrop_PhongBan('Drop_tbl_PhongBanId', 'Chọn phòng ban', '', congtyy, selectedValue)
        });
        $('#Drop_tbl_PhongBanId').on('change', function () {
            let selectedValue = $(this).val();
            let congtyy = $('#Drop_tbl_CompanyId').val();
            let cosoo = $('#Drop_tbl_CompanyId').val();
            me.loadDrop_NhanSu('Drop_tbl_NhanSuId', 'Chọn nhân sự', '', congtyy, cosoo, selectedValue)
        });
        $("#btnLinkThucHien").click(function (e) {
            var link = $('#txtLinkThucHien').val();
            if (link) {
                window.open(link, '_blank');
            } else {
                Core.showToast('Hiện chưa có đường dẫn được nhập!', 'warning');
            }
        }); 
    }, 


    /*CRUD*/
    filterCongViec: function (meCV) {
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
            phongban = me.tkphongbanId; 
        }
        var jsonData = {  
            Keyword: $("#searchTuKhoa").val() || '',
            tbl_CompanyId: (me.roleId == 99) ? $("#searchDropCongTy").val() : me.CongTyId, 
            tbl_CoSoId: ((me.roleId == 1) || (me.roleId == 99)) ? $("#searchDropCoSo").val() : me.tkcosoId, 
            tbl_PhongBanId: phongban,
            tbl_NhanSuId: ((me.roleId == 4) || meCV) ? Core.tknhansuId : '', 
            tbl_Category_ChucVuId:  $("#searchDropChucVu").val() || '',   
            TinhTrang: $("#DropTinhTrang_search").val(),
            StatusId: $("#DropTrangThai").val(),
        };
         
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
                "url": '/CongViec/FilterCongViec',
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
                { "data": "MaCongViec", "className": "text-center" },
                { "data": "TenCongViec", "className": "text-center" },  
                { "data": "NgayBatDau", "className": "text-center" },
                { "data": "NgayKetThuc", "className": "text-center" },
                { "data": "CreatedBy", "className": "text-center" },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.MucDo) { 
                            case 1:
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';
                                badgeText = '<i class="bi bi-flower3 me-2">Ưu tiên thấp</i>';
                                break;
                            case 2:
                                badgeClass = 'badge rounded-pill border border-info text-info fs-7';
                                badgeText = '<i class="bi bi-asterisk me-2">Ưu tiên bình thường</i>';
                                break;
                            case 3:
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';
                                badgeText = '<i class="bi bi-fire me-2">Ưu tiên cao</i>';
                                break;
                            default:
                                badgeClass = 'badge rounded-pill border border-secondary text-secondary fs-7';
                                badgeText = 'Không xác định';
                        }

                        return `<h4><span title="Tình trạng của cơ sở" class="${badgeClass}">${badgeText}</span></h4>`;
                    }
                },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrang) {
                            case 1:
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';
                                badgeText = 'Lên kế hoạch';
                                break;
                            case 2:
                                badgeClass = 'badge rounded-pill border border-info text-info fs-7';
                                badgeText = 'Đang thực hiện';
                                break;
                            case 3:
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';
                                badgeText = 'Đã hoãn lại';
                                break;
                            case 4:
                                badgeClass = 'badge rounded-pill border border-success text-success fs-7';
                                badgeText = 'Hoàn thành';
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
                        if (row.RoleId == me.roleId) {
                            return '<a title="Sao chép" id="' + row.Id + '" type="copy" tinhtrang="' + row.TinhTrang + '" class="action-icon text-success btnNhanBan" href="javascript:void(0);"><i class="fa-regular fa-copy"></i></a>';
                        } else {
                            return '<a id="' + row.Id + '" type="noAction" class="action-icon text-muted" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        }
                    },
                    "className": "text-center",
                    "visible": !(me.roleId == 4) && !(meCV)
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) { 
                            return '<a title="Chỉnh sửa" id="' + data + '" type="edit" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                    },  
                }
                , 
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        if ((row.RoleId > me.roleId) ||
                            (
                                (row.RoleId == me.roleId &&  Core.tkchucvuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') ||
                                (row.RoleId == me.roleId &&  Core.tkchucvuId == '640D0AC8-3C54-49A0-944B-025B4B0F05CF')
                            ) || (me.roleId == 99) || (me.roleId == 1) || (me.roleId == 4)) {
                            var str = '<div class="atp-nowrap">';
                            if (!me.RecoverMode) {
                                str += '<a title="Xóa dữ liệu" id="' + data + '" type="delete" class="action-icon text-success btnXoa" href="javascript:void(0);"><i class="fa-solid fa-trash"></i></a>';
                            }
                            else {
                                str += '<a title="Khôi phục dữ liệu" id="' + data + '" type="recover" class="action-icon text-success btnKhoiPhuc" href="javascript:void(0);"><i class="fa-solid fa-rotate-right"></i></a>';
                            }
                            return str;
                        } else {
                            return '<a id="' + row.Id + '" type="noAction" class="action-icon text-muted" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        }
                        
                    },
                    "visible": !(me.roleId == 4) && !(meCV)
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        if ((row.RoleId > me.roleId) ||
                            (
                                (row.RoleId == me.roleId && Core.tkchucvuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') ||
                                (row.RoleId == me.roleId && Core.tkchucvuId == '640D0AC8-3C54-49A0-944B-025B4B0F05CF')
                            ) || (me.roleId == 99) || (me.roleId == 1) || (me.roleId == 4)) {
                            return '<input type="checkbox" class="form-check-input" id="category' + row.Id + '" name="category' + row.Id + '" data-trang-thai="' + row.TinhTrang + '">';
                        } else {
                            return '<a id="' + row.Id + '" type="noAction" class="action-icon text-muted" href="javascript:void(0);"><i class="bi bi-ban"></i></a>';
                        }
                    },
                    "className": "text-center",
                    "visible": !(me.roleId == 4) && !(meCV)
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
        var me = this;

        let MaCongViec = $("#txtMaCongViec").val();
        let TenCongViec = $("#txtTenCongViec").val();
        let NgayBatDau = $("#txtNgayBatDau").val();
        let NgayKetThuc = $("#txtNgayKetThuc").val();
        let TinhTrang = $("#editDropTinhTrang").val();
        let MucDo = $("#editDropMucDo").val();
        let MoTaChiTiet = $("#txtMoTa").val();
        let LinkThucHien = $("#txtLinkThucHien").val();
        let tbl_CompanyId = $("#Drop_tbl_CompanyId").val();
        let tbl_CoSoId = $("#Drop_tbl_CoSoId").val();
        let tbl_PhongBanId = $("#Drop_tbl_PhongBanId").val();
        let tbl_NhanSuId = $("#Drop_tbl_NhanSuId").val();

        let jsonData = {
            'MaCongViec': me.Id ? MaCongViec : '',
            'TenCongViec': TenCongViec,
            'NgayBatDau': NgayBatDau,
            'NgayKetThuc': NgayKetThuc,
            'TinhTrang': TinhTrang || 1,
            'MucDo': MucDo || 2,
            'RoleId': me.roleId,
            'MoTaChiTiet': MoTaChiTiet,
            'LinkThucHien': LinkThucHien,
            'tbl_CompanyId': tbl_CompanyId ? tbl_CompanyId : me.CongTyId,
            'tbl_CoSoId': tbl_CoSoId ? tbl_CoSoId : me.tkcosoId,
            'tbl_PhongBanId': tbl_PhongBanId ? tbl_PhongBanId : me.tkphongbanId,
            'tbl_NhanSuId': me.roleId == 4 ? Core.exportValueUrl('id') : tbl_NhanSuId,
            'tbl_Category_ChucVuId': (me.roleId == 1 || me.roleId == 99) ? 1 : Core.tkchucvuId,
            'CreatedBy': Core.userName,
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
            url: '/CongViec/save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    me.resetSearch();
                    me.filterCongViec();
                    if (action == 1) {
                        me.resetEdit();
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

        // Temporarily remove change event handlers
        $('#Drop_tbl_CompanyId').off('change');
        $('#Drop_tbl_CoSoId').off('change');
        $('#Drop_tbl_PhongBanId').off('change'); 
        $('#Drop_tbl_NhanSuId').off('change');

        $.ajax({
            type: 'POST',
            url: '/CongViec/GetCongViecById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    if (obj != null) { 
                        $("#btnSaveAndNew").prop("hidden", true);

                        $("#txtMaCongViec").val(obj.MaCongViec);
                        $("#txtTenCongViec").val(obj.TenCongViec);
                        $("#txtNgayBatDau").val(obj.NgayBatDau);
                        $("#txtNgayKetThuc").val(obj.NgayKetThuc);

                        $("#editDropTinhTrang").val(obj.TinhTrang).trigger("change");
                        $("#editDropMucDo").val(obj.MucDo).trigger("change");

                        $("#txtMoTa").val(obj.MoTaChiTiet);
                        $("#txtLinkThucHien").val(obj.LinkThucHien);

                        $("#Drop_tbl_CompanyId").val(obj.tbl_CompanyId).trigger("change");
                        $("#Drop_tbl_CoSoId").val(obj.tbl_CoSoId).trigger("change");
                        $("#Drop_tbl_PhongBanId").val(obj.tbl_PhongBanId).trigger("change");
                        $("#Drop_tbl_NhanSuId").val(obj.tbl_NhanSuId).trigger("change");
                        if (obj.RoleId < me.roleId) {
                            $("#txtTenCongViec").prop("disabled", true);
                            $("#txtNgayBatDau").prop("disabled", true);
                            $("#txtNgayKetThuc").prop("disabled", true);
                            $("#editDropMucDo").prop("disabled", true);
                            $("#txtLinkThucHien").prop("disabled", true);
                            $("#Drop_tbl_NhanSuId").prop("disabled", true);
                        }
                    } else {
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
            complete: function () {
                // Reattach change event handlers
                $('#Drop_tbl_CompanyId').on('change', function () {
                    let selectedValue = $(this).val();
                    me.loadDrop_CoSo('Drop_tbl_CoSoId', 'Chọn cơ sở', '', selectedValue);
                });
                $('#Drop_tbl_CoSoId').on('change', function () {
                    let selectedValue = $(this).val();
                    let congtyy = $('#Drop_tbl_CompanyId').val();
                    me.loadDrop_PhongBan('Drop_tbl_PhongBanId', 'Chọn phòng ban', '', congtyy, selectedValue);
                });
                $('#Drop_tbl_PhongBanId').on('change', function () {
                    let selectedValue = $(this).val();
                    let congtyy = $('#Drop_tbl_CompanyId').val();
                    let cosoo = $('#Drop_tbl_CoSoId').val();
                    me.loadDrop_NhanSu('Drop_tbl_NhanSuId', 'Chọn nhân sự', '', congtyy, cosoo, selectedValue);
                });
            }
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
            url: '/CongViec/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filterCongViec(); 
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
    resetSearch: function () {
        $("#searchTuKhoa").val(''); 
        $("#searchDropCongTy").val('').trigger('change');
        $("#searchDropCoSo").val('').trigger('change');
        $("#searchDropPhongBan").val('').trigger('change');
        $("#searchDropChucVu").val('').trigger('change'); 
        $("#DropTinhTrang_search").val('').trigger('change'); 
        $("#DropTrangThai").val('1').trigger('change');
        $("#chkSelectAll").prop('checked', false);
        this.filterCongViec();
    },  
    hiddenShowByRoleId: function () {
        var me = this;
        switch (me.roleId) {
            case '99':
                $('#zone_CoSo').prop('hidden', false);
                $('#zone_company').prop('hidden', false);
                $('#zone_PhongBan').prop('hidden', false);

                $('#col_tbl_CompanyId').prop('hidden', false);
                $('#col_tbl_CoSoId').prop('hidden', false);
                $('#col_tbl_PhongBanId').prop('hidden', false);

                me.jsValidYC += ', #Drop_tbl_CompanyId, #Drop_tbl_CoSoId, #Drop_tbl_PhongBanId'
                break;

            case '1':
                $('#zone_PhongBan').prop('hidden', false);
                $('#zone_CoSo').prop('hidden', false);
                $('#zone_ChucVu').appendTo('#first_row');

                $('#col_tbl_CoSoId').prop('hidden', false);
                $('#col_tbl_PhongBanId').prop('hidden', false);
                $('#col_tbl_PhongBanId').appendTo('#row_2');

                me.jsValidYC += ', #Drop_tbl_CoSoId, #Drop_tbl_PhongBanId'
                break;

            case '2':
                $('#zone_ChucVu').appendTo('#first_row');
                $('#zone_PhongBan').prop('hidden', false);
                $('#zone_TinhTrang').appendTo('#first_row');

                $('#col_tbl_PhongBanId').prop('hidden', false); 

                me.jsValidYC += ', #Drop_tbl_PhongBanId'
                break;

            case '3':
                $('#zone_ChucVu').appendTo('#first_row');
                $('#zone_TinhTrang').appendTo('#first_row');
                $('#zone_TrangThai').appendTo('#first_row');
                $('#btnAnDieuKien').prop('hidden', true);
                break;

            case '4':
                $('#zone_ChucVu').appendTo('#first_row');
                $('#zone_TinhTrang').appendTo('#first_row');
                $('#zone_TrangThai').appendTo('#first_row');
                $('#btnAnDieuKien').prop('hidden', true);
                $('#zone_ChucVu').prop('hidden', true);
                $('#zone_TrangThai').prop('hidden', true);
                $('#zone_btnCRUD').prop('hidden', true);
                $("#col_tbl_NhanSuId").prop("hidden", true);
                $("#btnMyCV").prop("hidden", true);
                $("#btnSaveAndNew").prop("hidden", true);

                $("#txtTenCongViec").prop("disabled", true);
                $("#txtNgayBatDau").prop("disabled", true);
                $("#txtNgayKetThuc").prop("disabled", true); 
                $("#editDropMucDo").prop("disabled", true); 
                $("#txtLinkThucHien").prop("disabled", true);

                me.jsValidYC = me.jsValidYC.replace(', #Drop_tbl_NhanSuId', '');

                break;

            default: 
                break;
        }

    },  
    resetEdit: function () {
        this.Id = '';
        $('#txtMaCongViec').val('').prop('disabled', true);   
        $('#txtTenCongViec').val('');   
        $('#Drop_tbl_CompanyId').val('').trigger('change');  
        $('#Drop_tbl_CoSoId').val('').trigger('change');     
        $('#Drop_tbl_PhongBanId').val('').trigger('change'); 
        $('#Drop_tbl_NhanSuId').val('').trigger('change');   
                                                             
        $('#editDropTinhTrang').val('1').trigger('change');  
        $('#editDropMucDo').val('2').trigger('change');      
         
        $('#txtMoTa').val('');   

        $('#txtLinkThucHien').val('');
        $("#myModalLabel").html("Thêm công việc");

        let today = new Date();
        let day = String(today.getDate()).padStart(2, '0');
        let month = String(today.getMonth() + 1).padStart(2, '0');  
        let year = today.getFullYear();
         
        let todayFormatted = `${day}/${month}/${year}`;
         
        $('#txtNgayKetThuc').val(todayFormatted);
        $('#txtNgayBatDau').val(todayFormatted);

        $("#txtTenCongViec").prop("disabled", false);
        $("#txtNgayBatDau").prop("disabled", false);
        $("#txtNgayKetThuc").prop("disabled", false);
        $("#editDropMucDo").prop("disabled", false);
        $("#txtLinkThucHien").prop("disabled", false);
        $("#Drop_tbl_NhanSuId").prop("disabled", false);
    }, 


    //get drop
    loadDrop_NhanSu: function (zone_id, strTitle, defaultValue, congty, cosoId, phongbanId) {
        var me = this;
        var jsonData = {
            Keyword: '',
            tbl_CoSoId: cosoId ? cosoId : me.tkcosoId,
            tbl_PhongBanId: phongbanId ? phongbanId : me.tkphongbanId,
            tbl_CompanyId: congty ? congty : me.CongTyId,
            StatusId: 1,
            TinhTrang: 2,
            RoleId: me.roleId== 99 ? 1 : me.roleId,
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
                            if ((json[i].RoleId > me.roleId) ||  
                                (
                                (json[i].RoleId == me.roleId &&   Core.tkchucvuId == '21EDBCF4-2E47-4BE7-9547-2B1165366A22') ||
                                (json[i].RoleId == me.roleId &&  Core.tkchucvuId == '640D0AC8-3C54-49A0-944B-025B4B0F05CF')
                                )|| (me.roleId == 99)
                            ) {
                                getList += "<option name='" + json[i].MaNhanVien + "' role='" + json[i].RoleId + "' chucvuID='" + json[i].tbl_Category_ChucVuId + "' value='" + json[i].Id + "'>" + json[i].HoTen + "</option>";
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
    },
    loadDrop_CoSo: function (zone_id, strTitle, defaultValue, company) {
        var me = this;
        var jsonData = {
            TenCoSo: '',
            tbl_CompanyId: company ? company : me.CongTyId,
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
    loadDrop_PhongBan: function (zone_id, strTitle, defaultValue, company, coso) {
        var me = this;
        var jsonData = {
            TenPhongBan: '',
            tbl_CoSoId: coso ? coso : me.tkcosoId,
            tbl_CompanyId: company ? company : me.CongTyId,
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
}; 