function HDLD_lstBangLuong() { } 
HDLD_lstBangLuong.prototype = {
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
        this.filterHDLD_lstBangLuong();
    },
    init_event: function () {
        var me = this;
         
        $("#btnTimKiem").on("click", function () {
            me.filterHDLD_lstBangLuong();
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
        $(document).delegate('.action-icon', 'click', function () {
            var id = this.id;
            var type = this.type;
            var nhanSuId = $(this).attr('nhanSuId');
            console.log(nhanSuId, 'kkkkk')
             
            switch (type) {
                case 'edit':
                    me.Id = id;
                    window.open('/ChamCong/DetailChamCongView?id=' + nhanSuId, '_blank');
                    break; 
            }
        }); 
    }, 


    /*CRUD*/
    filterHDLD_lstBangLuong: function () {
        var me = this; 
        let phongban;
        if ((me.roleId == 1) || (me.roleId == 99) || (me.roleId == 2)) {
            phongban = $("#searchDropPhongBan").val();
        } else { 
            phongban = me.tkphongbanId; 
        }

        var thangTK = $("#DropThang_search").val() || (new Date().getMonth() + 1);
        var namTK = $("#DropNam_search").val() || (new Date().getFullYear());


        var jsonData = {  
            Keyword: $("#searchTuKhoa").val() || '',
            tbl_CompanyId: (me.roleId == 99) ? $("#searchDropCongTy").val() : me.CongTyId, 
            tbl_CoSoId: ((me.roleId == 1) || (me.roleId == 99)) ? $("#searchDropCoSo").val() : me.tkcosoId, 
            tbl_PhongBanId: '',
            Thang: thangTK,
            Nam: namTK,
            tbl_NhanSuId: '', 
            tbl_Category_ChucVuId:  $("#searchDropChucVu").val() || '',   
            TinhTrang: 2,
            StatusId: '',
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
                "url": '/ChamCong/FilterChamCongTheoThang',
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
                'aTargets': [8]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 6, 7, 8, 9],
            } 
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "tbl_NhanSuName", "className": "text-center" },
                { "data": "tbl_PhongBanName", "className": "text-center" },  
                { "data": "tbl_Category_ChucVuName", "className": "text-center" },
                {
                    "data": "LuongThangHDLD",
                    "className": "text-end",
                    "render": function (data, type, row) {
                        if (type === 'display' && data) {
                            let formattedData = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            return `<i>${formattedData} vnđ</i>`;  
                        }
                        return data;
                    }
                },
                { "data": "SoCongHDLD", "className": "text-center" },
                { "data": "TongNgayLamThucTe", "className": "text-center" },
                {
                    "data": "TongLuongThucTe",
                    "className": "text-end",
                    "render": function (data, type, row) {
                        if (type === 'display' && data) {
                            let formattedData = data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            return `<i>${formattedData} vnđ</i>`;
                        }
                        return data;
                    }
                },
                {
                    "mData": "Id",
                    "mRender": function (data, type, row) {
                        return '<a title="Chỉnh sửa" id="' + data + '" type="edit" nhanSuId="' + row.tbl_NhanSuId + '" class="action-icon text-success btnSua" href="javascript:void(0);"><i class="fa-regular fa-pen-to-square"></i></a>';
                    },  
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
     
    /*Utility*/
    resetSearch: function () {
        $("#searchTuKhoa").val(''); 
        $("#searchDropCongTy").val('').trigger('change');
        $("#searchDropCoSo").val('').trigger('change');
        $("#searchDropPhongBan").val('').trigger('change');
        $("#searchDropChucVu").val('').trigger('change'); 
        $("#DropThang_search").val('').trigger('change'); 
        $("#DropNam_search").val('1').trigger('change');
        $("#chkSelectAll").prop('checked', false);
        this.filterHDLD_lstBangLuong(); 

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
                $('#zone_Thang').appendTo('#first_row');

                $('#col_tbl_PhongBanId').prop('hidden', false); 

                me.jsValidYC += ', #Drop_tbl_PhongBanId'
                break;

            case '3':
                $('#zone_ChucVu').appendTo('#first_row');
                $('#zone_Thang').appendTo('#first_row');
                $('#zone_Nam').appendTo('#first_row');
                $('#btnAnDieuKien').prop('hidden', true);
                break;

            case '4':
                $('#zone_ChucVu').appendTo('#first_row'); 
                $('#zone_Thang').appendTo('#first_row');
                $('#zone_Nam').appendTo('#first_row');
                $('#zone_TrangThai').prop('hidden', true);
                $('#zone_btnCRUD').prop('hidden', true);
                $("#col_tbl_NhanSuId").prop("hidden", true); 
                $('#btnAnDieuKien').prop('hidden', true);


                break;

            default: 
                break;
        }

    },    
}; 