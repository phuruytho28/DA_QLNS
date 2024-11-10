function Category() { } 
Category.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    userName: '',
    tkcosoId: '',
    RecoverMode: false,
    jsValid_AD: '#txtMaDanhMuc, #txtTenDanhMuc',
    jsValid: '#txtMaDanhMuc, #txtTenDanhMuc,#editDropDanhMuc',
    session: {},

    StatusCode: Object.freeze({
        Actived: 1, 
        Deleted: 2,
    }),

    TinhTrang: Object.freeze({
        Initialize: 1, //khởi tạo
        Actived: 2, 
        Stop: 3,
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
        if (me.roleId != 90) {
            $('#zone_company').hide();
        } 
        Core.loadDrop_Company('searchDropCongTy', 'Chọn công ty', '');
        me.loadDrop_TenDanhMuc('searchDropDanhMuc', 'Chọn danh mục', '');
        me.loadDrop_TenDanhMuc('editDropDanhMuc', 'Chọn danh mục', '');
        if ((me.roleId == 3) || (me.roleId == 4)) {
            $("#btnThemMoi").prop('hidden', true);
            $("#btnRecycleBin").prop('hidden', true);
        }
        this.filterCategory();
    },
    init_event: function () {
        var me = this;
         
        $("#btnTimKiem").on("click", function () {
            me.filterCategory();
        });
        $("#btnHuyTimKiem").on("click", function () {
            me.resetSearch();
        }); 
        $("#btnThemMoi").on("click", function () {
            me.resetPopup();
            $("#myModalLabel").html("Thêm mới danh mục");
        }); 
        $("#btnSave").click(function (e) {
            e.preventDefault();
            var valid;
            if (me.roleId === 99) {
                valid = Core.validateRequiredFields(me.jsValid_AD);
            } else {
                valid = Core.validateRequiredFields(me.jsValid);
            }
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
                    me.getDataById(id);
                    $("#staticBackdrop").modal('show');
                    $("#myModalLabel").html("Cập nhật danh mục");
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
        $('#editDropDanhMuc').on('change', function () {
            var selectedValue = $(this).val();
            if (selectedValue == 'AFE9D16B-A8FA-454D-8E1F-873491A092D8') { 
                $('#row_check').prop('hidden', false);
            } else {
                $('#row_check').prop('hidden', true);
            }
        }); 
         
    },
    init_action: function () {
        var me = this;
    }, 


    /*CRUD*/
    filterCategory: function () {
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
            Keyword: $("#txtKeyword").val() || '',
            TinhTrang: $("#DropCapDM").val(),
            PhanLoaiDM: $("#searchDropDanhMuc option:selected").attr("name"),
            tbl_CompanyId: (me.roleId === 90) ? '' : me.CongTyId,  
            tbl_CoSoId: (me.roleId === 90) ? '' : me.tkcosoId,  
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
                "url": '/Category/FilterPrivate_Category',
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
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8]
            }
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "Name", "className": "text-center" },
                { "data": "MoTa" },
                { "data": "Note", "className": "text-center" },
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        var isDisabled = (me.roleId != 99 && !row.tbl_CompanyId) || (me.roleId == 3) || (me.roleId == 4);
                        var disableClass = 'disabled';
                        var ariaDisabled = 'aria-disabled="true"';
                        var dropdown = '<div class="atp-nowrap">';
                        if (isDisabled) {
                            dropdown += '<a title="Sao chép" id="' + data + '" class="action-icon-disabled text-muted btnNhanBan ' + disableClass + '" href="javascript:void(0);" ' + ariaDisabled + '><i class="fa-regular fa-copy"></i></a>';
                        } else {
                            dropdown += '<a title="Sao chép" id="' + data + '" type="copy" class="action-icon text-success btnNhanBan" href="javascript:void(0);"><i class="fa-regular fa-copy"></i></a>';
                        }
                        dropdown += '</div>';
                        return dropdown;
                    }
                },
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        var isDisabled = (me.roleId != 99 && !row.tbl_CompanyId) || (me.roleId == 3) || (me.roleId == 4);
                        var disableClass = 'disabled';
                        var ariaDisabled = 'aria-disabled="true"';
                        var dropdown = '<div class="atp-nowrap">';
                        if (isDisabled) {
                            dropdown += '<a title="Chỉnh sửa" id="' + data + '" class="action-icon-disabled text-muted btnSua ' + disableClass + '" href="javascript:void(0);" ' + ariaDisabled + '><i class="fa-regular fa-pen-to-square"></i></a>';
                        } else {
                            dropdown += '<a title="Chỉnh sửa" id="' + data + '" type="edit" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                        }
                        dropdown += '</div>';
                        return dropdown;
                    }
                }
                ,
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        var str = '<div class="atp-nowrap">';
                        if ((me.roleId != 99 && !row.tbl_CompanyId) || (me.roleId == 3) || (me.roleId == 4)) {
                            if (!me.RecoverMode) {
                                str += '<a title="Xóa dữ liệu" id="' + row.Id + '"  class="action-icon-disabled text-muted btnXoa disabled" href="javascript:void(0);" aria-disabled="true"><i class="fa-solid fa-trash"></i></a>';
                            } else {
                                str += '<a title="Khôi phục dữ liệu" id="' + row.Id + '" class="action-icon-disabled text-success btnKhoiPhuc disabled" href="javascript:void(0);" aria-disabled="true"><i class="fa-solid fa-rotate-right"></i></a>';
                            }
                        } else {
                            if (!me.RecoverMode) {
                                str += '<a title="Xóa dữ liệu" id="' + row.Id + '" type="delete" class="action-icon text-success btnXoa" href="javascript:void(0);"><i class="fa-solid fa-trash"></i></a>';
                            } else {
                                str += '<a title="Khôi phục dữ liệu" id="' + row.Id + '" type="recover" class="action-icon text-success btnKhoiPhuc" href="javascript:void(0);"><i class="fa-solid fa-rotate-right"></i></a>';
                            }
                        }
                        str += '</div>';
                        return str;
                    }
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        return '<input type="checkbox" class="form-check-input" id="category' + row.Id + '" name="category' + row.Name + '" data-trang-thai="' + row.TinhTrang + '">';
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
        let MaDanhMuc = $("#txtMaDanhMuc").val();
        let TenDanhMuc = $("#txtTenDanhMuc").val();
        let chkLoaiDM = $("#editDropDanhMuc").val();
        let LoaiDM = $("#editDropDanhMuc option:selected").attr("name");
        let valchk = document.getElementById("chkDanhMuc").checked ? 3 : 0;
        console.log(LoaiDM, 'kkkkk')
        let GhiChu = $("#txtGhiChu").val(); 
        let jsonData = {
            'Name': MaDanhMuc,
            'MoTa': TenDanhMuc,
            'Note': GhiChu,
            'RoleId': valchk,
            'tbl_CompanyId': me.CongTyId,
            'tbl_CoSoId': me.tkcosoId,
            'CreatedBy': Core.userName,
            'PhanLoaiDM': chkLoaiDM ? LoaiDM : MaDanhMuc,
            'TinhTrang': chkLoaiDM ? 9 : 10,
            'StatusId': me.StatusId_Edit,
            'DanhMucChaId': chkLoaiDM,
            'Id': me.Id,
        };
         
        if (action == 0) {
            Core.startButtonLoading("btnSave");
        } else {
            Core.startButtonLoading("btnSaveAndNew");
        }
         
        $.ajax({
            type: 'POST',
            url: '/Category/Save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    me.resetSearch(); 
                    
                    if (action == 1) {
                        $("#myModalLabel").html("Thêm danh mục");
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
            url: '/Category/GetCategoryById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj) 
                    if (obj != null) { 
                        $("#txtMaDanhMuc").val(obj[0].Name);  
                        $("#editDropDanhMuc").val(obj[0].DanhMucChaId);
                        $("#txtTenDanhMuc").val(obj[0].MoTa);
                        $("#txtGhiChu").val(obj[0].Note);

                        if (obj[0].PhanLoaiDM == 'DMCV') {
                            $('#row_check').prop('hidden', false);
                        }
                        if (obj[0].RoleId != 0) {
                            $("#chkDanhMuc").prop('checked', true);
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


    loadDrop_TenDanhMuc: function (zone_id, strTitle, defaultValue) {
        var me = this;
        var jsonData = {  
            StatusId: 1,
            TinhTrang: 10,
            PageIndex: 1,
            PageSize: 10000000
        };
        $.ajax({
            url: '/Category/FilterCategory',
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
                            getList += "<option name='" + json[i].PhanLoaiDM + "' value='" + json[i].Id + "'>" + json[i].MoTa + "</option>";
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
            url: '/Category/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filterCategory(); 
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
        $("#searchTenCategory").val('');
        $("#searchDropCongTy").val('').trigger('change');
        $("#searchDropDanhMuc").val('1').trigger('change');
        $("#DropCapDM").val('9').trigger('change');
        this.filterCategory();
    },
    resetPopup: function () {
        var me = this; 
        $("#txtMaDanhMuc").val(""); 
        $("#txtTenDanhMuc").val("");
        $("#editDropDanhMuc").val("").trigger('change');
        $("#txtGhiChu").val(""); 
        me.StatusId_Edit = 1;
        me.Id = "";
    },
}; 