function CompanyDetail() { } 
CompanyDetail.prototype = {
    Id: '',
    roleId: '',
    StatusId_Edit: 1,
    CongTyId: '',
    userName: '',
    RecoverMode: false,
    jsValid: '#txtMaCongTy, #txtTenCongTy, #txtDiaChi, #txtSDT',
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
    },

    init_data: function () {
        var me = this; 
        me.roleId = Core.roleId;  
        this.getDataById(Core.companyId);
    },
    init_event: function () {
        var me = this; 
        $("#btnSave").click(function (e) {
            e.preventDefault();
            var valid = Core.validateRequiredFields(me.jsValid);
            if (valid == true) {
                me.save();
            }
            else {
                Core.showToast('Vui lòng không bỏ trống các trường có dấu (*)!', 'warning');
            }
        }); 
         
         
    }, 
    save: function () {
        var me = this;
        let TenCongTy = $("#txTenCS").val();
        let DiaChi = $("#txtDiaChi").val();
        let GhiChu = $("#txtGhiChu").val();
        let TinhTrang = $("#DropTinhTrang").val();
        let jsonData = {
            'TenCongTy': TenCongTy,
            'DiaChi': DiaChi,
            'Note': GhiChu ? GhiChu : 'Chưa có mô tả!',
            'tbl_CompanyId': me.CongTyId,
            'CreatedBy': Core.userName,
            'TinhTrang': TinhTrang,
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
            url: '/Company/Save',  
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
            complete: function () {  
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
            url: '/Company/GetCompanyId',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    console.log(obj)
                    if (obj != null) {
                        $("#txtTenCongTy").val(obj.TenCongTy);
                        $("#txtDiaChi").val(obj.DiaChi);
                        $("#txtSDT").val(obj.SDT); 
                        $("#txtMaCongTy").val(obj.MaCongTy);  
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

     
}; 