const TaxiDriver = require('../models/taxiModel');

// HELPER FUNCTIONS
const handleError = (res, error, operation) => {
  console.error(`Error ${operation}:`, error);
  
  if (error.name === 'ValidationError') {
    const errors = {};
    for (let field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    return res.status(400).json({
      success: false,
      error: 'Validation Failed',
      details: errors,
    });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists`,
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Server error',
  });
};

const buildFilter = (query) => {
  const { city, vehicleType, availability, capacity, minCapacity, maxCapacity, hasAC, hasLuggage, searchQuery } = query;
  const filter = {};
  
  if (city && city !== 'all') filter.serviceCity = { $regex: city, $options: 'i' };
  if (vehicleType && vehicleType !== 'all') filter.vehicleType = vehicleType;
  if (availability && availability !== 'all') filter.availableDays = availability;
  if (capacity) filter.seatingCapacity = { $gte: parseInt(capacity) };
  if (minCapacity != null || maxCapacity != null) {
    filter.seatingCapacity = {};
    if (minCapacity != null) filter.seatingCapacity.$gte = minCapacity;
    if (maxCapacity != null) filter.seatingCapacity.$lte = maxCapacity;
  }
  if (hasAC !== undefined) filter.hasAirConditioning = hasAC;
  if (hasLuggage !== undefined) filter.hasLuggageSpace = hasLuggage;
  if (searchQuery) {
    filter.$or = [
      { fullName: { $regex: searchQuery, $options: 'i' } },
      { vehicleMakeModel: { $regex: searchQuery, $options: 'i' } },
      { serviceCity: { $regex: searchQuery, $options: 'i' } },
    ];
  }
  
  return filter;
};

// YOUR ORIGINAL FUNCTION (unchanged)
const createTaxiDriver = async (req, res) => {
  try {
    const driverData = req.body;
    
    // Convert string fields to appropriate types
    const processedData = {
      ...driverData,
      yearsOfExperience: driverData.yearsOfExperience ? parseInt(driverData.yearsOfExperience) : 0,
      seatingCapacity: driverData.seatingCapacity ? parseInt(driverData.seatingCapacity) : 0,
      licenseExpiryDate: driverData.licenseExpiryDate ? new Date(driverData.licenseExpiryDate) : null,
      availableDays: driverData.availableDays || [],
      vehicleImages: driverData.vehicleImages || [],
      // Map drivingLicenseCardNumber to cnic if needed
      cnic: driverData.drivingLicenseCardNumber || driverData.cnic,
    };
    
    const newDriver = new TaxiDriver(processedData);
    const savedDriver = await newDriver.save();

    res.status(201).json({
      success: true,
      message: 'Taxi driver registered successfully',
      data: savedDriver,
    });
  } catch (error) {
    console.error('Error creating taxi driver:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists.`,
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server error. Could not register taxi driver.',
    });
  }
};

// NEW FUNCTIONS (shortened)
const createTaxiService = async (req, res) => {
  try {
    const driverData = req.body;
    
    // Convert string fields to appropriate types
    const processedData = {
      ...driverData,
      yearsOfExperience: driverData.yearsOfExperience ? parseInt(driverData.yearsOfExperience) : 0,
      seatingCapacity: driverData.seatingCapacity ? parseInt(driverData.seatingCapacity) : 0,
      licenseExpiryDate: driverData.licenseExpiryDate ? new Date(driverData.licenseExpiryDate) : null,
      availableDays: driverData.availableDays || [],
      vehicleImages: driverData.vehicleImages || [],
      // Map drivingLicenseCardNumber to cnic if needed
      cnic: driverData.drivingLicenseCardNumber || driverData.cnic,
    };
    
    const newDriver = new TaxiDriver(processedData);
    const savedDriver = await newDriver.save();
    res.status(201).json({ success: true, data: savedDriver });
  } catch (error) {
    handleError(res, error, 'creating taxi driver');
  }
};

const getTaxiDrivers = async (req, res) => {
  console.log('Hi');
  try {
    const { page = 1, limit = 10 } = req.query;
    const filter = buildFilter(req.query);
    const skip = (page - 1) * limit;
    
    const [drivers, total] = await Promise.all([
      TaxiDriver.find(filter).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      TaxiDriver.countDocuments(filter)
    ]);
    
    res.status(200).json({
      success: true,
      data: drivers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDrivers: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    handleError(res, error, 'fetching taxi drivers');
  }
};

const getTaxiDriverById = async (req, res) => {
  try {
    const driver = await TaxiDriver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Taxi driver not found' });
    }
    
    console.log('Taxi driver data fetched by ID:', driver);
    
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    handleError(res, error, 'fetching taxi driver by ID');
  }
};

const searchTaxiDrivers = async (req, res) => {
  try {
    const filter = buildFilter({ ...req.body, searchQuery: req.body.query });
    const drivers = await TaxiDriver.find(filter);
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    handleError(res, error, 'searching taxi drivers');
  }
};

const updateTaxiService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const existingDriver = await TaxiDriver.findById(id);
    if (!existingDriver) {
      return res.status(404).json({ success: false, error: 'Taxi driver not found' });
    }
    
    const updatedDriver = await TaxiDriver.findByIdAndUpdate(
      id,
      {
        ...updateData,
        licenseExpiryDate: updateData.licenseExpiryDate ? new Date(updateData.licenseExpiryDate) : existingDriver.licenseExpiryDate
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: updatedDriver });
  } catch (error) {
    handleError(res, error, 'updating taxi driver');
  }
};

const deleteTaxiService = async (req, res) => {
  try {
    const deletedDriver = await TaxiDriver.findByIdAndDelete(req.params.id);
    if (!deletedDriver) {
      return res.status(404).json({ success: false, error: 'Taxi driver not found' });
    }
    res.status(200).json({ success: true, data: deletedDriver });
  } catch (error) {
    handleError(res, error, 'deleting taxi driver');
  }
};

const addTaxi = async (req, res) => {
  res.status(201).json({ message: 'Taxi driver added!' });
};

module.exports = {
  createTaxiDriver, // Your original function
  createTaxiService,
  getTaxiDrivers,
  getTaxiDriverById,
  searchTaxiDrivers,
  updateTaxiService,
  deleteTaxiService,
  addTaxi,
};