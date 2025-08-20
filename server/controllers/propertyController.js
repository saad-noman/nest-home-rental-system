import { validationResult } from 'express-validator';
import Property from '../models/Property.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

// @desc Get all properties with filters
// @route GET /api/properties
// @access Public
export const getProperties = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const {
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
      bedrooms,
      propertyType,
      availabilityStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      lat,
      lng,
      radius = 10
    } = req.query;

    // Build search query
    const searchQuery = { isActive: true };

    // Add price filters
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Add other filters
    if (bedrooms) searchQuery.bedrooms = Number(bedrooms);
    if (propertyType) searchQuery.propertyType = propertyType;
    if (availabilityStatus) searchQuery.availabilityStatus = availabilityStatus;

    // Add text search
    if (search) {
      searchQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Add location search
    if (lat && lng) {
      const radiusInDegrees = radius / 111; // Rough conversion km to degrees
      searchQuery['coordinates.latitude'] = {
        $gte: Number(lat) - radiusInDegrees,
        $lte: Number(lat) + radiusInDegrees
      };
      searchQuery['coordinates.longitude'] = {
        $gte: Number(lng) - radiusInDegrees,
        $lte: Number(lng) + radiusInDegrees
      };
    }

    // Set up sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get properties
    const properties = await Property.find(searchQuery)
      .populate('owner', 'name email phone')
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Add current tenant info (simplified)
    const propertiesWithTenants = await addCurrentTenantInfo(properties);

    // Get total count for pagination
    const total = await Property.countDocuments(searchQuery);

    res.json({
      data: {
        properties: propertiesWithTenants,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error while fetching properties' });
  }
};

// Helper function to add current tenant information
const addCurrentTenantInfo = async (properties) => {
  if (!properties.length) return properties;

  const now = new Date();
  const propertyIds = properties.map(p => p._id);

  // Find current active bookings
  const activeBookings = await Booking.find({
    property: { $in: propertyIds },
    startDate: { $lte: now },
    endDate: { $gt: now },
    status: { $in: ['approved', 'completed'] }
  }).populate('tenant', 'name');

  // Create a map for quick lookup
  const tenantMap = new Map();
  activeBookings.forEach(booking => {
    tenantMap.set(booking.property.toString(), {
      id: booking.tenant._id,
      name: booking.tenant.name
    });
  });

  // Add tenant info to properties
  return properties.map(property => {
    const propertyObj = property.toObject();
    const tenant = tenantMap.get(property._id.toString());
    if (tenant) {
      propertyObj.currentTenant = tenant;
    }
    return propertyObj;
  });
};

// @desc Get top-rated properties (by average rating and review count)
// @route GET /api/properties/top-rated
// @access Public
export const getTopRatedProperties = async (req, res) => {
  try {
    const { limit = 6, minReviews = 1 } = req.query;

    // Get property ratings using aggregation
    const propertyRatings = await Review.aggregate([
      { 
        $group: { 
          _id: '$property', 
          averageRating: { $avg: '$rating' }, 
          totalReviews: { $sum: 1 } 
        } 
      },
      { $match: { totalReviews: { $gte: Number(minReviews) } } },
      { $sort: { averageRating: -1, totalReviews: -1 } },
      { $limit: Number(limit) }
    ]);

    if (!propertyRatings.length) {
      return res.json({ data: { properties: [] } });
    }

    // Get the actual property details
    const propertyIds = propertyRatings.map(rating => rating._id);
    const properties = await Property.find({ 
      _id: { $in: propertyIds }, 
      isActive: true 
    }).populate('owner', 'name email phone');

    // Combine property data with ratings
    const propertiesWithRatings = properties.map(property => {
      const rating = propertyRatings.find(r => r._id.toString() === property._id.toString());
      return {
        ...property.toObject(),
        averageRating: rating?.averageRating || 0,
        totalReviews: rating?.totalReviews || 0
      };
    });

    // Sort by rating and review count
    propertiesWithRatings.sort((a, b) => {
      if (b.averageRating !== a.averageRating) {
        return b.averageRating - a.averageRating;
      }
      return b.totalReviews - a.totalReviews;
    });

    res.json({ data: { properties: propertiesWithRatings } });
  } catch (error) {
    console.error('Get top-rated properties error:', error);
    res.status(500).json({ message: 'Server error while fetching top-rated properties' });
  }
};

// @desc Get single property
// @route GET /api/properties/:id
// @access Public
export const getProperty = async (req, res) => {
  try {
    // Find the property
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone profileImage');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Find current tenant (if any)
    const now = new Date();
    const activeBooking = await Booking.findOne({
      property: property._id,
      startDate: { $lte: now },
      endDate: { $gt: now },
      status: { $in: ['approved', 'completed'] }
    }).populate('tenant', 'name');

    // Convert to object and add tenant info
    const propertyData = property.toObject();
    if (activeBooking) {
      propertyData.currentTenant = {
        id: activeBooking.tenant._id,
        name: activeBooking.tenant.name
      };
    }

    res.json({
      data: { property: propertyData }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error while fetching property' });
  }
};

// @desc Create property
// @route POST /api/properties
// @access Private (Owner, Admin)
export const createProperty = async (req, res) => {
  try {
    // Create property with current user as owner
    const propertyData = {
      ...req.body,
      owner: req.user._id
    };

    const property = new Property(propertyData);
    await property.save();

    // Get the created property with owner details
    const createdProperty = await Property.findById(property._id)
      .populate('owner', 'name email phone');

    res.status(201).json({
      message: 'Property created successfully',
      data: { property: createdProperty }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error while creating property' });
  }
};

// @desc Update property
// @route PUT /api/properties/:id
// @access Private (Owner of property, Admin)
export const updateProperty = async (req, res) => {
  try {
    // Find the property first
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns this property or is admin
    if (req.user.role !== 'admin' && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      message: 'Property updated successfully',
      data: { property: updatedProperty }
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error while updating property' });
  }
};

// @desc Delete property
// @route DELETE /api/properties/:id
// @access Private (Owner of property, Admin)
export const deleteProperty = async (req, res) => {
  try {
    // Find the property
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns this property or is admin
    if (req.user.role !== 'admin' && property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Soft delete by marking as inactive
    await Property.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error while deleting property' });
  }
};

// @desc Get properties by owner
// @route GET /api/properties/owner/:ownerId
// @access Public
export const getPropertiesByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const properties = await Property.find({ 
      owner: ownerId, 
      isActive: true 
    })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments({ 
      owner: ownerId, 
      isActive: true 
    });

    res.json({
      data: {
        properties,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get properties by owner error:', error);
    res.status(500).json({ message: 'Server error while fetching owner properties' });
  }
};