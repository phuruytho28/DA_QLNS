function DetailNhanSu() { } 
DetailNhanSu.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    userName: '',
    RecoverMode: false,
    jsValid: '#txtMaNhanVien, #txtHoTen, #txtNgaySinh, #txtEmail, #txtSDT, #txtDiaChiQue, #txtSoCCCD, #DropGioiTinh, #DropHocVan, #DropDanToc, #DropTonGiao, #DropQueQuan_Tinh, #DropQueQuan_Huyen, #DropHienTai_Tinh, #DropHienTai_Huyen, #DropChucVu, #DropPhongBan, #DropCoSo, #DropNoiCapCCCD_Tinh',
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
        me.Id = Core.exportValueUrl('id');
        me.roleId = Core.roleId; 
        me.CongTyId = Core.companyId; 
        Core.loadDrop_CoSo('DropCoSo', 'Chọn công ty', '');
        Core.loadDrop_PhongBan('DropPhongBan', 'Chọn phòng ban', '');
        Core.loadDrop_Category('DropDanToc', 'Chọn dân tộc', '', 'DMDT', 9); 
        Core.loadDrop_Category('DropHocVan', 'Chọn học vấn', '', 'DMHV', 9); 
        Core.loadDrop_Category('DropTonGiao', 'Chọn Tôn giáo', '', 'DMTG', 9); 
        Core.loadDrop_Category('DropChucVu', 'Chọn chức vụ', '', 'DMCV', 9); 

        Core.loadDrop_DiaChi('DropQueQuan_Tinh', 'Tinh', ''); 
        Core.loadDrop_DiaChi('DropHienTai_Tinh', 'Tinh', ''); 
        Core.loadDrop_DiaChi('DropNoiCapCCCD_Tinh', 'Tinh', '');
        Core.loadDrop_DiaChi('DropHienTai_Huyen', '', '');
        Core.loadDrop_DiaChi('DropQueQuan_Huyen', '', '');

        me.Id ? me.getDataById(me.Id) :
        this.filterNhanSu();
    },
    init_event: function () {
        var me = this;
        $("#btnSave_T").click(function (e) {
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
        $('#imageUpload').on('change', function (event) {
            me.previewImage(event);
        }); 
        $('#DropQueQuan_Tinh').on('change', function () {
            var selectedOption = $(this).find('option:selected');
            var selectedValue = selectedOption.attr('name');
            if (selectedValue) {
                $("#DropQueQuan_Huyen").prop('disabled', false)
            }
            Core.loadDrop_DiaChi('DropQueQuan_Huyen', selectedValue, '');
        });

        $('#DropHienTai_Tinh').on('change', function () {
            var selectedOption = $(this).find('option:selected');
            var selectedValue = selectedOption.attr('name');
            if (selectedValue) {
                $("#DropHienTai_Huyen").prop('disabled', false)
            }
            Core.loadDrop_DiaChi('DropHienTai_Huyen', selectedValue, '');
        });
    },
    init_action: function () {
        var me = this;
    }, 

    previewImage: function (event) {
        const imageContainer = $('#imageContainer');
        const uploadButton = $('#uploadButton');
        const file = event.target.files[0];

        if (file) {
            // Tạo phần tử img để hiển thị ảnh
            const img = $('<img>').attr('src', URL.createObjectURL(file))
                .css({
                    'width': '100%',
                    'height': '100%',
                    'object-fit': 'cover',
                    'position': 'absolute',
                    'top': '0',
                    'left': '0'
                });

            // Ẩn nút "Chọn ảnh" và thêm ảnh vào khung
            imageContainer.append(img);

            // Giữ nút "Chọn ảnh" hiển thị nhưng cho nó độ mờ
            uploadButton.addClass('opacity-50');
        }
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
            TenNhanSu: $("#searchTenNhanSu").val() || '',
            tbl_CompanyId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropCongTy").val() || '' : '', 
            tbl_CoSoId: ((me.roleId === 1) || (me.roleId === 90)) ? $("#searchDropCoSo").val() || '' : '', 
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
                'aTargets': [6, 7, 8]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8]
            }
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "MaNhanSu", "className": "text-center" },
                { "data": "TenNhanSu", "className": "text-center" },
                { "data": "tbl_CoSoName" },
                { "data": "tbl_NhanSuName", "className": "text-center" },
                {
                    "data": null,
                    "className": "text-center",
                    "render": function (data, type, row) {
                        var badgeClass = '';
                        var badgeText = '';
                        switch (row.TinhTrang) {
                            case 1:  
                                badgeClass = 'badge rounded-pill border border-primary text-primary fs-7';  
                                badgeText = 'Đang khởi tạo';
                                break;
                            case 2:  
                                badgeClass = 'badge rounded-pill border border-success text-success fs-7';  
                                badgeText = 'Đang hoạt động';
                                break;
                            case 3:  
                                badgeClass = 'badge rounded-pill border border-danger text-danger fs-7';  
                                badgeText = 'Dừng hoạt động';
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
                    "mRender": function (data) {
                        var dropdown = '<a title="Sao chép" id="' + data + '" type="copy" class="action-icon text-success btnNhanBan" href="javascript:void(0);"><i class="fa-regular fa-copy"></i></a>';  
                        return dropdown;
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
         
        let jsonData = {
            'MaNhanVien': MaNhanVien,
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
            'tbl_CompanyId': me.CongTyId, 
            'CreatedBy': Core.userName,
            'TinhTrang':  1,
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
            url: '/NhanSu/Save',  
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
            url: '/NhanSu/GetNhanSuById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                        $("#txtMaNhanVien").val(obj.MaNhanVien);
                        $("#txtHoTen").val(obj.HoTen);
                        $("#txtNgaySinh").val(obj.NgaySinh);
                        $("#txtEmail").val(obj.Email);
                        $("#txtSDT").val(obj.SDT);
                        $("#txtDiaChiQue").val(obj.DiaChi_Que);
                        $("#txtDiaChiHienTai").val(obj.DiaChi_HienTai);
                        $("#txtSoCCCD").val(obj.SoCCCD);
                        $("#txtGhiChu").val(obj.Note);

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
    /*Utility*/
    resetSearch: function () {
        $("#searchTenNhanSu").val('');
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