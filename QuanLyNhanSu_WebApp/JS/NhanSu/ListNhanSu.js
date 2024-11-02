function ListNhanSu() { } 
ListNhanSu.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    userName: '',
    RecoverMode: false,
    //jsValid: '#txTenPB, #editDropCoSo, #txMaPB',
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
        if ((me.roleId === 1) || (me.roleId === 90)) {
            $('#zone_company').hide();
        } 
        Core.loadDrop_Company('searchDropCongTy', 'Chọn công ty', '');
        Core.loadDrop_CoSo('searchDropCoSo', 'Chọn công ty', '');
        Core.loadDrop_CoSo('editDropCoSo', 'Chọn công ty', '');
        Core.loadDrop_PhongBan('searchDropPhongBan', 'Chọn phòng ban', '');
        Core.loadDrop_Category('searchDropChucVu', 'Chọn chức vụ', '', 'DMCV', 9);
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
        $("#btnSave").click(function (e) {
            e.preventDefault();
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.save(0);
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $("#btnSaveAndNew").click(function (e) {
            e.preventDefault();
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.save(1);
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        });
        $(document).delegate('.action-icon', 'click', function () {
            //coreRoot.utility.resetInputForm_Valid(me.JsonValidate);
            var id = this.id;
            var type = this.type;
            if (id == '' || id == undefined || id == null) return;
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
                    me.getDataById(id);
                    $("#staticBackdrop").modal('show');
                    $("#myModalLabel").html("Sao chép thông tin"); 
                    me.Id = "";
                    me.StatusId_Edit = me.StatusCode.Actived;
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

        var jsonData = {
            Keyword: $("#searchTuKhoa").val() || '',
            tbl_CompanyId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropCongTy").val() || '' : '', 
            tbl_CoSoId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropCoSo").val() || '' : '', 
            tbl_PhongBanId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropPhongBan").val() || '' : '', 
            tbl_Category_ChucVuId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropChucVu").val() || '' : '', 
            tblCategory_Que_TinhId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropQueQuan").val() || '' : '', 
            TinhTrang: $("#DropTinhTrang_search").val() || -1,
            StatusId: $("#DropTrangThai").val() || -1,
        };

        // Tách cấu hình DataTables
        var dtConfig = {
            "paging": true,
            "pageLength": 10,
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
                { "data": "NgayBatDauLamViec", "className": "text-center" },
                {
                    "mData": "Id",
                    "mRender": function (data) {
                        var dropdown = '<a title="Sao chép" id="' + data + '" type="copy" class="action-icon text-success btnNhanBan" href="javascript:void(0);"><i class="fa-regular fa-copy"></i></a>';  
                        return dropdown;
                    }
                }
                ,
                {
                    "mData": null,
                    "mRender": function (data, type, row) {
                        var dropdown = '<a title="Chỉnh sửa" id="' + row.Id + '" type="edit" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';  
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
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        return '<input type="checkbox" class="form-check-input" id="category' + row.Id + '" name="category' + row.Id + '" data-trang-thai="' + row.TinhTrang + '">';
                    },
                    "className": "text-center"
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
            url: '/PhongBan/UpdateStatusId',
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
    /*Utility*/
    resetSearch: function () {
        $("#searchTenPhongBan").val('');
        $("#searchDropCongTy").val('').trigger('change');
        $("#DropTinhTrang_search").val('').trigger('change');
        $("#DropTrangThai").val('1').trigger('change');
        this.filterNhanSu();
    },
    resetPopup: function () {
        var me = this; 
        $("#txTenPB").val(""); 
        $("#txMaPB").val("");
        $("#editDropCoSo").val("").trigger('change');
        $("#txtGhiChu").val(""); 
        me.StatusId_Edit = 1;
        me.Id = "";
    },
}; 