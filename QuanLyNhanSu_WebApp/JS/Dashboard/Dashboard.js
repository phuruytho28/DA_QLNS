function Dashboard() { }

Dashboard.prototype = {
    Id: '',
    roleId: '',
    CongTyId: '',
    PhongBanId: '',
    CoSoId: '',
    NhanSuId: '',
    userName: '',

    pieCharts: [], // Biến để lưu trữ các biểu đồ Pie
    barCharts: [], // Biến để lưu trữ các biểu đồ Bar

    init: function () {
        this.init_data();
    },

    init_data: function () {
        var me = this;
        me.roleId = Core.roleId;

        me.CongTyId = Core.companyId;
        me.CoSoId = Core.tkcosoId;
        me.PhongBanId = Core.tkphongbanId;
        me.NhanSuId = Core.tknhansuId;

        // Dữ liệu cho biểu đồ Pie
        var pieData = {
            labels: ["Đang tuyển", "Khởi tạo", "Hoạt động", "Ngừng hoạt động"],
            datasets: [{
                data: [123, 50, 100, 200],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"]
            }]
        };

        // Phá hủy biểu đồ Pie nếu tồn tại
        me.pieCharts.forEach(chart => chart.destroy());
        me.pieCharts = []; // Xóa danh sách biểu đồ cũ

        // Tạo biểu đồ Pie mới
        me.pieCharts.push(new Chart(document.getElementById("pieChart1"), { type: 'pie', data: pieData, options: { responsive: true } }));
        me.pieCharts.push(new Chart(document.getElementById("pieChart2"), { type: 'pie', data: pieData, options: { responsive: true } }));
        me.pieCharts.push(new Chart(document.getElementById("pieChart3"), { type: 'pie', data: pieData, options: { responsive: true } }));

        // Dữ liệu cho biểu đồ Bar
        var barData1 = {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
            datasets: [{ label: 'Thống kê công việc', data: [65, 59, 80, 81], backgroundColor: "#36A2EB" }]
        };

        var barData2 = {
            labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
            datasets: [{ label: 'Thống kê lương thưởng', data: [28, 48, 40, 19], backgroundColor: "#FF6384" }]
        };

        // Phá hủy biểu đồ Bar nếu tồn tại
        me.barCharts.forEach(chart => chart.destroy());
        me.barCharts = []; // Xóa danh sách biểu đồ cũ

        // Tạo biểu đồ Bar mới
        me.barCharts.push(new Chart(document.getElementById("barChart1"), {
            type: 'bar',
            data: barData1,
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        }));
        me.barCharts.push(new Chart(document.getElementById("barChart2"), {
            type: 'bar',
            data: barData2,
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } }
            }
        }));

        this.getDataById();
    },

    getDataById: function () {
        var me = this;
        let jsonData = {
            'tbl_CompanyId': me.CongTyId,
            'tbl_PhongBanId': me.PhongBanId,
            'tbl_CoSoId': me.CoSoId,
            'tbl_NhanSuId': me.NhanSuId,
        };
        $.ajax({
            type: 'POST',
            url: '/Dashboard/GetDashboardById',
            data: JSON.stringify(jsonData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                if (response.Success) {
                    var obj = response.Data;
                    if (obj != null) {
                        $("#congty").text(obj.TongSoCongTy);
                    } else {
                        Core.showToast('Không có dữ liệu trả về', 'danger');
                    }
                } else {
                    Core.showToast(response.Message, 'danger');
                }
            },
            error: function (xhr, status, error) {
                Core.showToast('Đã xảy ra lỗi khi lấy dữ liệu: ' + error, 'danger');
            },
        });
    }
};
