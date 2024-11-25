function ChamCong() { } 
ChamCong.prototype = {
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
    jsValid: '#txtLuongThangHDLD1, #txtSoGioLamTrongThang, #txtTongCongDaLam, #txtLuongThangTamTinh, #txtPhuCap1, #txtThuong1, #txtTongLuongThucTe',
    dinhdangTien: 'txtLuongThangHDLD, txtLuongThangHDLD1, txtLuongTamTinh, txtSoTienNgay, txtLuongThangTamTinh, txtPhuCap1, txtPhuCap2, txtPhuCap3, txtThuong1, txtThuong2, txtThuong3, txtKhoanTru1, txtKhoanTru2, txtKhoanTru3, txtTongLuongThucTe',
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
        me.nhansuId = Core.exportValueUrl('id'); 
        me.roleId = Core.roleId; 
        me.CongTyId = Core.companyId;
        me.tkcosoId = Core.tkcosoId;
        me.tkphongbanId = Core.tkphongbanId;
        Core.DinhDangTien(me.dinhdangTien);
        //me.nhansuId = Core.nhansuId;
        me.tkC3 = Core.tkC3;
        me.hiddenShowByRoleId();
         
        Core.loadDrop_Company('search_tblDropCongTy', 'Chọn công ty', ''); 
        Core.loadDrop_CoSo('Drop_tbl_CoSoId', 'Chọn cơ sở', '');   
        Core.loadDrop_PhongBan('Drop_tbl_PhongBanId', 'Chọn phòng ban', '');
        Core.loadDrop_NhanSu_Full('Drop_tbl_NhanSuId', 'Chọn nhân sự', '');  
        if ((me.roleId != 1) || (me.roleId != 99)) {
            Core.loadDrop_Category_ChucVu('Drop_tbl_Category_ChucVuId', 'Chọn chức vụ', '', 'DMCV', 9); 
        } else {
            Core.loadDrop_Category('Drop_tbl_Category_ChucVuId', 'Chọn chức vụ', '', 'DMCV', 9);
        } 
         
        if(me.nhansuId) {
            setTimeout(function () {
                me.getDataByNhanSuId(me.nhansuId);
                console.log(me.roleId);
                if ((me.roleId == 3) || (me.roleId == 4 )) {
                    me.getDataByTime_Id();
                } 
                me.getDataByTime_TheoThang();
            }, 1050);

        }; 
    },
    init_event: function () {
        var me = this;
         
        $("#btnTimKiem").on("click", function () {
            if (me.nhansuId) {
                setTimeout(function () {
                    me.getDataByNhanSuId(me.nhansuId);
                    me.getDataByTime_Id();
                    me.getDataByTime_TheoThang();
                }, 1050);

            }; 
        });
        $("#btnBack").on("click", function () {
            window.open('/HDLD_lstBangLuong/ListHDLD_lstBangLuongView', '_self');
        });   
        $("#btnThemMoi").on("click", function () {
            me.resetEdit();
            $("#staticBackdrop").modal('show');
        }); 
        $("#btnDuyet").click(function (e) {
            e.preventDefault(); 
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.saveTheoThang();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        }); 
        $("#btnTGVao").click(function (e) {
            e.preventDefault();
            const currentTime = new Date().toLocaleTimeString('en-GB');  
            var chkVao = $("#txtGioVao").val();
            if (chkVao) {
                $("#txtGioVao").prop('disabled', true);
                Core.showToast('Bạn đã chấm công vào cho hôm nay!', 'warning');
            } else { 
                $("#txtGioVao").val(currentTime);
                me.save();
            }
        }); 
        $("#btnTGRa").click(function (e) {
            e.preventDefault();
            var currentTime = new Date().toLocaleTimeString('en-GB');  
            var txtGioRa = $("#txtGioRa").val(); 
            var txtGioVao = $("#txtGioVao").val();
            if (txtGioRa && txtGioVao) {
                $("#txtGioRa").prop('disabled', true);
                Core.showToast('Bạn đã hoàn thành chấm công cho hôm nay!', 'warning');
            } else { 
                if (txtGioVao) {
                    $("#txtGioRa").val(currentTime);
                    var gioralast = $("#txtGioRa").val();  
                    let [hoursIn, minutesIn] = txtGioVao.split(':').map(Number);
                    let [hoursOut, minutesOut] = gioralast.split(':').map(Number);
                    let dateIn = new Date();
                    dateIn.setHours(hoursIn, minutesIn, 0, 0);

                    let dateOut = new Date();
                    dateOut.setHours(hoursOut, minutesOut, 0, 0);
                    let timeDiffMs = dateOut - dateIn;

                    let hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
                    let minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));
                    let totalHoursDecimal = hours + (minutes / 60);
                    let result = totalHoursDecimal.toFixed(2);
                    var tientheogio = $("#txtSoTienGio").val().replace(/\./g, ''); // Remove dots
                    tientheogio = parseFloat(tientheogio);
                     
                    var tienngay = Math.round((parseFloat(result) * tientheogio).toFixed(2)); 
                    $("#txtTongSoGio").val(result);
                    $("#txtLuongTamTinh").val(tienngay);




                    me.save('check');
                } else {
                    Core.showToast('Bạn đã chưa chấm công vào cho ngày hôm nay!', 'warning');
                }
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
                    $('#txtMaChamCong').val('').prop('disabled', true); 
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
        $("#txtLuongThangTamTinh, #txtPhuCap1, #txtPhuCap2, #txtPhuCap3, #txtThuong1, #txtThuong2, #txtThuong3, #txtKhoanTru1, #txtKhoanTru2, #txtKhoanTru3").on("change", function () {
            me.calculateTongLuongThucTe();
            Core.DinhDangTien(me.dinhdangTien);
        });
            
    }, 


    /*CRUD*/
    filterChamCong: function (congty, coso, phongban, nhansu, sotien,chk) {
        var me = this;  

        var thangTK = $("#DropThang_search").val();
        var namTK = $("#DropNam_search").val();
         
        let Thang = $("#txtmonth").val();
        let Nam = $("#txtyear").val(); 

        var jsonData = {  
            Keyword: $("#searchTuKhoa").val() || '',
            tbl_CompanyId: (me.roleId == 99) ? '': congty, 
            tbl_CoSoId: (me.roleId == 99) ? '' : coso,
            tbl_PhongBanId: (me.roleId == 99) ? '' : (phongban ? phongban : me.tkphongbanId),
            tbl_NhanSuId: Core.exportValueUrl('id'), 
            Thang: thangTK ? thangTK : Thang,
            Nam: namTK ? namTK : Nam  ,
            tbl_Category_ChucVuId: '',   
            TinhTrang: 2,
            StatusId: 1,
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
                "url": '/ChamCong/FilterChamCong',
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
                    let totalLuongTamTinh = 0;
                    let totalTongSoGio = 0;

                     
                    json.data.forEach(row => {
                        let luongTamTinhValue = parseFloat(row.LuongTamTinh) || 0;
                        totalLuongTamTinh += luongTamTinhValue;

                        let tongSoGioValue = parseFloat(row.TongSoGio) || 0;
                        totalTongSoGio += tongSoGioValue;
                    });

                     
                    $("#txtTongCongDaLam").val(json.TotalRows); 
                    $("#txtLuongThangTamTinh").val(Math.round(totalLuongTamTinh.toFixed(2)));
                    $("#txtSoGioLamTrongThang").val(totalTongSoGio.toFixed(2));
                    var mel = $("#txtLuongThangTamTinh").val();
                    var meli = $("#txtSoGioLamTrongThang").val();
                    me.calculateTongLuongThucTe();

                    if (chk) {
                        me.saveTheoThang();
                    } 
                    Core.DinhDangTien(me.dinhdangTien);
                    return JSON.stringify(json);
                }
            },
            "aoColumnDefs": [{
                'bSortable': false,
                'aTargets': [8]
            },
            {
                className: "dt-body-center", "targets": [1, 2, 3, 4, 5, 6, 7, 8]
            }
            ],
            "columns": [
                { "data": "Id", "visible": false },   
                { "data": "RowNum", "className": "text-center" },
                { "data": "Ngay", "className": "text-center" },
                { "data": "Thang", "className": "text-center" },
                { "data": "Nam", "className": "text-center" },  
                { "data": "GioVao", "className": "text-center" },
                { "data": "GioRa", "className": "text-center" },
                { "data": "TongSoGio", "className": "text-center" },
                {
                    "data": "LuongTamTinh",
                    "className": "text-center",
                    "render": function (data, type, row) {
                        if (type === 'display' && data) {
                            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        }
                        return data;
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
    save: function (chk) {
        var me = this; 
        let Ngay = $("#txtday").val();
        let Thang = $("#txtmonth").val();
        let Nam = $("#txtyear").val();
        let GioVao = $("#txtGioVao").val();
        let GioRa = $("#txtGioRa").val();
        let TongSoGio = $("#txtTongSoGio").val();
        let LuongTamTinh = $("#txtLuongTamTinh").val().replace(/\./g, '');

        let LuongThangHDLD = $("#txtLuongThangHDLD").val().replace(/\./g, '');
        let SoCongHDLD = $("#txtSoCongHDLD").val();

        let tbl_CompanyId = $("#Drop_tbl_CompanyId").val();
        let tbl_CoSoId = $("#Drop_tbl_CoSoId").val();
        let tbl_PhongBanId = $("#Drop_tbl_PhongBanId").val();
        let tbl_NhanSuId = $("#Drop_tbl_NhanSuId").val();
        let tbl_Category_ChucVuId = $("#Drop_tbl_Category_ChucVuId").val();
        //let tbl_Category_ChucVu_NguoiTaoId = Core.tkchucvuId;

        let jsonData = {
             
            'Ngay': Ngay, 
            'Thang': Thang,
            'Nam': Nam,
            'GioVao': GioVao,
            'GioRa': GioRa,
            'TongSoGio': TongSoGio,
            'LuongTamTinh': LuongTamTinh,
            'LuongThangHDLD': LuongThangHDLD,
            'SoCongHDLD': SoCongHDLD,

            'TinhTrang': 2, 
            'RoleId': me.roleId, 
            'tbl_CompanyId': tbl_CompanyId ? tbl_CompanyId : me.CongTyId,
            'tbl_CoSoId': tbl_CoSoId ? tbl_CoSoId : me.tkcosoId,
            'tbl_PhongBanId': tbl_PhongBanId ? tbl_PhongBanId : me.tkphongbanId,
            'tbl_NhanSuId': tbl_NhanSuId ? tbl_NhanSuId : Core.tknhansuId,
            'tbl_Category_ChucVuId': (me.roleId == 1 || me.roleId == 99) ? 1 : tbl_Category_ChucVuId || 1,
            'CreatedBy': Core.userName,
            'StatusId': 1,
            'Id': '',
        };  
         
        $.ajax({
            type: 'POST',
            url: '/ChamCong/save',  
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    setTimeout(function () {
                        me.getDataByNhanSuId(me.nhansuId, chk);
                        me.getDataByTime_Id();
                    }, 1050); 
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {      
            }
        });
    },
    getDataByNhanSuId: function (id, chk) {
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
                            

                        $("#txtLuongThangHDLD").val(obj.MucLuongKyHD);
                        $("#txtLuongThangHDLD1").val(obj.MucLuongKyHD);
                        $("#txtSoCongHDLD").val(obj.SoCongHangThang);
                        let sotien = Math.floor(obj.MucLuongKyHD / obj.SoCongHangThang);
                        let sotiengio = Math.round(sotien / 8);

                        $("#txtSoTienGio").val(sotiengio);
                        Core.DinhDangTien('txtSoTienGio');

                        //$("#txtTongSoGio").val(sotien);

                        $("#txtSoTienNgay").val(sotien);

                        $("#search_tblDropCongTy").val(obj.tbl_CompanyId).trigger("change");
                        $("#Drop_tbl_CoSoId").val(obj.tbl_CoSoId).trigger("change");
                        $("#Drop_tbl_PhongBanId").val(obj.tbl_PhongBanId).trigger("change");
                        $("#Drop_tbl_NhanSuId").val(obj.tbl_NhanSuId).trigger("change");
                        $("#Drop_tbl_Category_ChucVuId").val(obj.tbl_Category_ChucVuId).trigger("change");

                        me.filterChamCong(obj.tbl_CompanyId, obj.tbl_CoSoId, obj.tbl_PhongBanId, obj.tbl_NhanSuId, sotien, chk);
                          
                        Core.DinhDangTien(me.dinhdangTien);  

                    } else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'warning');
                    $("#btnTGVao").prop('disabled', true);
                    $("#btnTGRa").prop('disabled', true);
                    $("#btnDuyet").prop('disabled', true);
                    $("#row_luuy").prop('hidden', false);
                    Core.showModal_Confirm(
                        'Thông báo',
                        'Bạn không thể thực hiện chấm công do chưa có thông tin về hợp đồng lao động! Đang chuyển hướng về trang chủ sau 5s...'
                    );
                    $('.modal-footer').hide();
                    setTimeout(function () {

                        window.open('/Dashboard/DashboardView', '_self');

                    }, 5000);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {
                // Reattach change event handlers 
            }
        });
    },
    getDataByTime_Id: function () {
        var me = this;
        var thangTK = $("#DropThang_search").val();
        var namTK = $("#DropNam_search").val();

        let Ngay = $("#txtday").val();
        let Thang = $("#txtmonth").val();
        let Nam = $("#txtyear").val();
        let jsonData = {  
            'tbl_NhanSuId': me.nhansuId,
            'Ngay':  Ngay,
            'Thang': thangTK ? thangTK : Thang,
            'Nam': namTK ? namTK : Nam  
        };

        $.ajax({
            type: 'POST',
            url: '/ChamCong/ChamCong_GetByDate',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {


                        $("#txtGioVao").val(obj.GioVao);
                        $("#txtGioRa").val(obj.GioRa);
                        $("#txtTongSoGio").val(obj.TongSoGio);
                        $("#txtLuongTamTinh").val(obj.LuongTamTinh); 

                        Core.DinhDangTien(me.dinhdangTien);

                    } else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'warning');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {
                // Reattach change event handlers 
            }
        });
    },
    getDataByTime_TheoThang: function () {
        var me = this;
        var thangTK = $("#DropThang_search").val();
        var namTK = $("#DropNam_search").val();

        let Ngay = $("#txtday").val();
        let Thang = $("#txtmonth").val();
        let Nam = $("#txtyear").val();
        let jsonData = {
            'tbl_NhanSuId': me.nhansuId,
            'Ngay': Ngay,
            'Thang': thangTK ? thangTK : Thang,
            'Nam': namTK ? namTK : Nam
        };


        $.ajax({
            type: 'POST',
            url: '/ChamCong/ChamCongTheoThang_GetByDate',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                         
                        $("#txtPhuCap1").val(obj.PhuCap1);
                        $("#txtPhuCap2").val(obj.PhuCap2);
                        $("#txtPhuCap3").val(obj.PhuCap3);
                        $("#txtThuong1").val(obj.Thuong1);
                        $("#txtThuong2").val(obj.Thuong2);
                        $("#txtThuong3").val(obj.Thuong3);
                        $("#txtKhoanTru1").val(obj.KhoanTru1);
                        $("#txtKhoanTru2").val(obj.KhoanTru2);
                        $("#txtKhoanTru3").val(obj.KhoanTru3); 
                        $("#txtTongLuongThucTe").val(obj.TongLuongThucTe); 

                        Core.DinhDangTien(me.dinhdangTien);

                        if ((obj.RoleId < me.roleId) || (obj.roleId == 99)) {  
                            $("#btnDuyet").prop('hidden', true);
                        }

                    } else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {

                    $("#txtPhuCap1").val('');
                    $("#txtPhuCap2").val('');
                    $("#txtPhuCap3").val('');
                    $("#txtThuong1").val('');
                    $("#txtThuong2").val('');
                    $("#txtThuong3").val('');
                    $("#txtKhoanTru1").val('');
                    $("#txtKhoanTru2").val('');
                    $("#txtKhoanTru3").val('');
                    $("#txtTongLuongThucTe").val('');
                    Core.DinhDangTien(me.dinhdangTien);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {
                // Reattach change event handlers 
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
            url: '/ChamCong/UpdateStatusId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success'); 
                    $('#tbldata').dataTable().fnClearTable();
                    me.filterChamCong(); 
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
    hiddenShowByRoleId: function () {
        var me = this;
        if (Core.tknhansuId != Core.exportValueUrl('id')) {
            $('#z_buttonChamCong').prop('hidden', true); 
        }
        if (Core.tknhansuId == Core.exportValueUrl('id')) { 
            $('#btnBack').prop('hidden', true);
        }
        switch (me.roleId) {
            case '99':   
            case '1': 
            case '2':
                $("#txtPhuCap1").prop('disabled', false);
                $("#txtPhuCap2").prop('disabled', false);
                $("#txtPhuCap3").prop('disabled', false);
                $("#txtThuong1").prop('disabled', false);
                $("#txtThuong2").prop('disabled', false);
                $("#txtThuong3").prop('disabled', false);
                $("#txtKhoanTru1").prop('disabled', false);
                $("#txtKhoanTru2").prop('disabled', false);
                $("#txtKhoanTru3").prop('disabled', false);
                break;

            case '3':
                if (me.tkC3 != 'NHANSU') {
                    $("#txtPhuCap1").prop('disabled', false);
                    $("#txtPhuCap2").prop('disabled', false);
                    $("#txtPhuCap3").prop('disabled', false);
                    $("#txtThuong1").prop('disabled', false);
                    $("#txtThuong2").prop('disabled', false);
                    $("#txtThuong3").prop('disabled', false);
                    $("#txtKhoanTru1").prop('disabled', false);
                    $("#txtKhoanTru2").prop('disabled', false);
                    $("#txtKhoanTru3").prop('disabled', false);
                } else {
                    $("#btnDuyet").prop('hidden', true);
                }
                break;

            case '4':
                if (me.tkC3 == 'NHANSU') {
                    $("#txtPhuCap1").prop('disabled', false);
                    $("#txtPhuCap2").prop('disabled', false);
                    $("#txtPhuCap3").prop('disabled', false);
                    $("#txtThuong1").prop('disabled', false);
                    $("#txtThuong2").prop('disabled', false);
                    $("#txtThuong3").prop('disabled', false);
                    $("#txtKhoanTru1").prop('disabled', false);
                    $("#txtKhoanTru2").prop('disabled', false);
                    $("#txtKhoanTru3").prop('disabled', false); 
                }else {
                    $("#btnDuyet").prop('hidden', true);
                }
                break;

            default: 
                break;
        }

    },   

    calculateTongLuongThucTe: function () { 
        let luongTamTinh = parseFloat($("#txtLuongThangTamTinh").val().replace(/,/g, '').replace(/\./g, '')) || 0;
     
        let phuCap1 = parseFloat($("#txtPhuCap1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let phuCap2 = parseFloat($("#txtPhuCap2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let phuCap3 = parseFloat($("#txtPhuCap3").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let totalPhuCap = phuCap1 + phuCap2 + phuCap3;
     
        let thuong1 = parseFloat($("#txtThuong1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let thuong2 = parseFloat($("#txtThuong2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let thuong3 = parseFloat($("#txtThuong3").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let totalThuong = thuong1 + thuong2 + thuong3;
     
        let khoanTru1 = parseFloat($("#txtKhoanTru1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let khoanTru2 = parseFloat($("#txtKhoanTru2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let khoanTru3 = parseFloat($("#txtKhoanTru3").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let totalKhoanTru = khoanTru1 + khoanTru2 + khoanTru3;
     
        let tongLuongThucTe = luongTamTinh + totalPhuCap + totalThuong - totalKhoanTru;
     
        $("#txtTongLuongThucTe").val(Math.round(tongLuongThucTe.toFixed(2)));
    },


    saveTheoThang: function () {
        var me = this;  

        var thangTK = $("#DropThang_search").val();
        var namTK = $("#DropNam_search").val();
          
            

        let Ngay = $("#txtday").val();
        let Thang = $("#txtmonth").val();
        let Nam = $("#txtyear").val(); 

        let LuongThangHDLD1 = $("#txtLuongThangHDLD").val().replace(/\./g, '');
        let SoCongHDLD = $("#txtSoCongHDLD").val();

        let tbl_CompanyId = $("#Drop_tbl_CompanyId").val();
        let tbl_CoSoId = $("#Drop_tbl_CoSoId").val();
        let tbl_PhongBanId = $("#Drop_tbl_PhongBanId").val();
        let tbl_NhanSuId = $("#Drop_tbl_NhanSuId").val();
        let tbl_Category_ChucVuId = $("#Drop_tbl_Category_ChucVuId").val();
        let TongNgayLamThucTe = $("#txtTongCongDaLam").val();
        let TongGioLamThucTe = $("#txtSoGioLamTrongThang").val();
        //let tbl_Category_ChucVu_NguoiTaoId = Core.tkchucvuId;

        let luongTamTinh = parseFloat($("#txtLuongThangTamTinh").val().replace(/,/g, '').replace(/\./g, '')) || 0;

        let phuCap1 = parseFloat($("#txtPhuCap1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let phuCap2 = parseFloat($("#txtPhuCap2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let phuCap3 = parseFloat($("#txtPhuCap3").val().replace(/,/g, '').replace(/\./g, '')) || 0;

        let thuong1 = parseFloat($("#txtThuong1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let thuong2 = parseFloat($("#txtThuong2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let thuong3 = parseFloat($("#txtThuong3").val().replace(/,/g, '').replace(/\./g, '')) || 0;

        let khoanTru1 = parseFloat($("#txtKhoanTru1").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let khoanTru2 = parseFloat($("#txtKhoanTru2").val().replace(/,/g, '').replace(/\./g, '')) || 0;
        let khoanTru3 = parseFloat($("#txtKhoanTru3").val().replace(/,/g, '').replace(/\./g, '')) || 0;

        let TongLuongThucTe = parseFloat($("#txtTongLuongThucTe").val().replace(/,/g, '').replace(/\./g, '')) || 0;


        let TongLuongTamThoiThucTe = parseFloat($("#txtLuongThangTamTinh").val().replace(/,/g, '').replace(/\./g, '')) || 0; 
         
        let jsonData = {

            'Ngay': Ngay,
            'Thang': thangTK ? thangTK : Thang,
            'Nam': namTK? namTK: Nam ,
            'SoCongHDLD': SoCongHDLD,
            'TongLuongThucTe': TongLuongThucTe,
            'LuongThangHDLD': LuongThangHDLD1,
            'TongLuongTamThoiThucTe': TongLuongTamThoiThucTe,
            'TongNgayLamThucTe': TongNgayLamThucTe,
            'TongGioLamThucTe': TongGioLamThucTe,

            'Thuong1': thuong1,
            'Thuong2': thuong2,
            'Thuong3': thuong3,
            'PhuCap1': phuCap1,
            'PhuCap2': phuCap2,
            'PhuCap3': phuCap3,
            'KhoanTru1': khoanTru1,
            'KhoanTru2': khoanTru2,
            'KhoanTru3': khoanTru3,

            'TinhTrang': 2,
            'RoleId': me.roleId,
            'tbl_CompanyId': tbl_CompanyId ? tbl_CompanyId : me.CongTyId,
            'tbl_CoSoId': tbl_CoSoId ? tbl_CoSoId : me.tkcosoId,
            'tbl_PhongBanId': tbl_PhongBanId ? tbl_PhongBanId : me.tkphongbanId,
            'tbl_NhanSuId': tbl_NhanSuId ? tbl_NhanSuId : Core.tknhansuId,
            'tbl_Category_ChucVuId': (me.roleId == 1 || me.roleId == 99) ? 1 : tbl_Category_ChucVuId || 1,
            'CreatedBy': Core.userName,
            'StatusId': 1,
            'Id': '',
        };

        $.ajax({
            type: 'POST',
            url: '/ChamCong/saveTheoThang',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    Core.showToast(response.Message, 'success');
                    setTimeout(function () {
                        me.getDataByNhanSuId(me.nhansuId);
                        if ((me.roleId == 3) || (me.roleId == 4)) {
                            me.getDataByTime_Id();
                        }
                    }, 1050);
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                Core.showToast('Đã xảy ra lỗi khi lưu dữ liệu: ' + error, 'danger');
            },
            complete: function () {
            }
        });
    },
}; 