const challanService = require("../services/challan.service");

exports.getChallans = async (req, res) => {
  try {
    const { registrationNumber } = req.query;

    if (!registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide registrationNumber"
      });
    }

    const rows = await challanService.fetchChallanData(registrationNumber);

    if (!rows || rows.length === 0) {
      return res.json({
        success: false,
        status: 0,
        message: "No challans found"
      });
    }

    const totalChallanCount = rows.reduce(
      (sum, row) => sum + (row.noOfChallan || 0),
      0
    );

    const totalValue = rows.reduce(
  (sum, row) => sum + Number(row.totalValue || 0),
  0
);


    res.json({
      success: true,
      status: 1,
      data: {
        registrationNumber,
        totalChallanCount,
        totalValue,
        rows
      },
      message: "Challan data fetched successfully",
      dataType: 1
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
