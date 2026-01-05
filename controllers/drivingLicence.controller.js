const drivingLicenceService = require("../services/drivingLicence.service");

exports.getDrivingLicence = async (req, res) => {
  try {
    const { registrationNumber, chassisNumber, engineNumber } = req.query;

    if (!registrationNumber && !chassisNumber && !engineNumber) {
      return res.status(400).json({
        success: false,
        message: "Provide registrationNumber or chassisNumber or engineNumber"
      });
    }

    const data = await drivingLicenceService.getDrivingLicenceData({
      registrationNumber,
      chassisNumber,
      engineNumber
    });

    if (!data) {
      return res.json({
        success: false,
        status: 0,
        message: "No data found"
      });
    }

    const { license, categories, personalInfo, additionalDetails } = data;

    res.json({
      success: true,
      status: 1,
      data: {
        licenseNumber: license.license_number,
        driverLicense: {
          categories: categories.map(c => ({
            code: c.code,
            description: c.description,
            issuedDate: c.issued_date
          })),
          issuingAuthority: license.issuing_authority,
          endorsementNumber: license.endorsement_number,
          nonTransportFrom: license.non_transport_from,
          nonTransportTo: license.non_transport_to,
          transportFrom: license.transport_from || "",
          transportTo: license.transport_to || "",
          oldLicNo: license.old_lic_no || "",
          hzFrom: license.hz_from || "",
          hzTo: license.hz_to || ""
        },
        personalInformation: {
          fullName: personalInfo.full_name,
          fatherName: personalInfo.father_name,
          dateOfBirth: personalInfo.date_of_birth,
          gender: personalInfo.gender,
          bloodGroup: personalInfo.blood_group || "",
          address: personalInfo.address,
          pinCode: personalInfo.pin_code,
          additionalDetails: {
            signature: additionalDetails.signature_url,
            photo: additionalDetails.photo_url
          }
        },
        responseType: 1
      },
      message: "Driving Licence data fetched successfully",
      dataType: 1
    });

  } catch (error) {
    console.error("❌ Driving Licence Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
