import { ObjectId } from "mongodb"
import { getDatabase } from "./mongodb"
import bcrypt from "bcryptjs"

// Database schema interfaces
export interface Admin {
  _id?: ObjectId
  id: string
  name: string
  email: string
  password: string
  role: "admin"
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface Agent {
  _id?: ObjectId
  id: string
  name: string
  email: string
  phone: string
  role: string
  specialization: string
  experience: string
  bio?: string
  licenseNumber: string
  languages?: string
  status: "active" | "inactive"
  avatar?: string
  joinedDate: string
  rating: number
  propertiesCount: number
  createdAt: string
  updatedAt: string
  username?: string
  password?: string
  lastLogin?: string
}

export interface Property {
  _id?: ObjectId
  id: number
  title: string
  address: string
  price: number
  priceType: string
  bedrooms: number
  bathrooms: number
  size: number
  type: string
  featured: boolean
  best: boolean
  status: "active" | "pending" | "rejected"
  images: string[]
  slug: string
  description: string
  yearBuilt: number
  propertyId: string | null
  neighborhood: string
  features: string[]
  location: {
    lat: number
    lng: number
    address: string
  }
  agentId: string | null
  agentName: string | null
  createdAt: string
  updatedAt: string
  submittedBy?: {
    name: string
    email: string
    phone: string
  }
}

export interface AdminStats {
  totalProperties: number
  activeProperties: number
  pendingProperties: number
  totalAgents: number
  activeAgents: number
  featuredProperties: number
  totalContacts: number
  newContacts: number
  totalBookings: number
  pendingBookings: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  _id?: ObjectId
  id: string
  type: "property_approved" | "property_rejected" | "agent_added" | "property_featured"
  message: string
  timestamp: string
  userId?: string
  propertyId?: number
  agentId?: string
}

export interface Contact {
  _id?: ObjectId
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "new" | "contacted" | "resolved"
  propertyId?: number
  propertyTitle?: string
  agentId?: string
  createdAt: string
  updatedAt: string
}

export interface Booking {
  _id?: ObjectId
  id: string
  propertyId: number
  propertyTitle: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  message?: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  agentId?: string
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  _id?: ObjectId
  id: string
  heroBackground: {
    type: "image" | "video"
    url: string
  }
  faqs?: {
    question: string
    answer: string
  }[]
  testimonials?: {
    name: string
    role: string
    quote: string
    image: string
  }[]
  cta?: {
    title: string
    description?: string
    buttonText: string
    buttonLink: string
    backgroundImage: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    badgeText?: string
    ratingText?: string
  }
  propertyTypes?: string[]
  updatedAt: string
}

// MongoDB Database class
class MongoDatabase {
  private initialized = false

  async initializeDatabase() {
    try {
      const db = await getDatabase()

      // Create default admin user if none exists
      const adminExists = await db.collection("admins").findOne({ email: "admin@realestate.com" })
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 12)
        const defaultAdmin: Admin = {
          id: "admin-1",
          name: "System Administrator",
          email: "admin@realestate.com",
          password: hashedPassword,
          role: "admin",
          phone: "+1234567890",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        await db.collection("admins").insertOne(defaultAdmin)
        console.log("Default admin user created")
      }

      this.initialized = true
    } catch (error) {
      console.error("Failed to initialize database:", error)
      throw error
    }
  }

  private async ensureInitialized() {
    if (this.initialized) return

    try {
      await this.initializeDatabase()
      this.initialized = true
    } catch (error) {
      console.error("Failed to initialize database:", error)
      // Don't throw here, let individual operations handle their own errors
    }
  }

  private async getNextSequence(name: string): Promise<number> {
    try {
      const db = await getDatabase()

      // For property IDs, ensure we get the next available ID
      if (name === "propertyId") {
        // Get the highest existing ID
        const properties = await db.collection("properties").find({}).sort({ id: -1 }).limit(1).toArray()
        const highestId = properties.length > 0 ? properties[0].id : 0
        return highestId + 1
      }

      // For other sequences, use the counter collection
      const result = await db
        .collection("counters")
        .findOneAndUpdate({ _id: name as any }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" })
      return result?.seq || 1
    } catch (error) {
      console.error("Error getting next sequence:", error)
      return Date.now() // Fallback to timestamp
    }
  }

  private async getNextPropertyNumber(): Promise<number> {
    try {
      const db = await getDatabase()
      const properties = await db
        .collection("properties")
        .find({ propertyId: { $regex: /^PR-\d+$/ } })
        .sort({ propertyId: -1 })
        .limit(1)
        .toArray()

      if (properties.length === 0) return 1

      const match = properties[0].propertyId?.match(/PR-(\d+)/)
      return match ? Number.parseInt(match[1]) + 1 : 1
    } catch (error) {
      console.error("Error getting next property number:", error)
      return 1
    }
  }

  // Admin methods
  async getAdmin(email: string): Promise<Admin | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const admin = await db.collection("admins").findOne({ email })
      return admin ? ({ ...admin, _id: undefined } as Admin) : null
    } catch (error) {
      console.error("Error fetching admin:", error)
      return null
    }
  }

  async getAdminById(id: string): Promise<Admin | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const admin = await db.collection("admins").findOne({ id })
      return admin ? ({ ...admin, _id: undefined } as Admin) : null
    } catch (error) {
      console.error("Error fetching admin by ID:", error)
      return null
    }
  }

  async updateAdmin(id: string, updates: Partial<Admin>): Promise<Admin | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const updatedAdmin = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      const result = await db
        .collection("admins")
        .findOneAndUpdate({ id }, { $set: updatedAdmin }, { returnDocument: "after" })

      return result ? ({ ...result, _id: undefined } as Admin) : null
    } catch (error) {
      console.error("Error updating admin:", error)
      return null
    }
  }

  async updateAdminPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const hashedPassword = await bcrypt.hash(newPassword, 12)

      const result = await db.collection("admins").updateOne(
        { id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
          },
        },
      )

      return result.modifiedCount > 0
    } catch (error) {
      console.error("Error updating admin password:", error)
      return false
    }
  }

  async verifyAdminPassword(email: string, password: string): Promise<Admin | null> {
    try {
      await this.ensureInitialized()
      const admin = await this.getAdmin(email)

      if (!admin) return null

      const isValid = await bcrypt.compare(password, admin.password)
      if (!isValid) return null

      // Update last login
      await this.updateAdmin(admin.id, { lastLogin: new Date().toISOString() })

      return admin
    } catch (error) {
      console.error("Error verifying admin password:", error)
      return null
    }
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const agents = await db.collection("agents").find({}).sort({ createdAt: -1 }).toArray()
      return agents.map((agent) => ({ ...agent, _id: undefined })) as Agent[]
    } catch (error) {
      console.error("Error fetching agents:", error)
      return []
    }
  }

  async getAgent(id: string): Promise<Agent | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const agent = await db.collection("agents").findOne({ id })
      return agent ? ({ ...agent, _id: undefined } as Agent) : null
    } catch (error) {
      console.error("Error fetching agent:", error)
      return null
    }
  }

  async getAgentByEmail(email: string): Promise<Agent | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const agent = await db.collection("agents").findOne({ email })
      return agent ? ({ ...agent, _id: undefined } as Agent) : null
    } catch (error) {
      console.error("Error fetching agent by email:", error)
      return null
    }
  }

  async verifyAgentPassword(email: string, password: string): Promise<Agent | null> {
    try {
      await this.ensureInitialized()
      const agent = await this.getAgentByEmail(email)

      if (!agent || !agent.password) return null

      const isValid = await bcrypt.compare(password, agent.password)
      if (!isValid) return null

      // Update last login
      await this.updateAgent(agent.id, { lastLogin: new Date().toISOString() })

      return agent
    } catch (error) {
      console.error("Error verifying agent password:", error)
      return null
    }
  }

  async updateAgentPassword(id: string, newPassword: string): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const hashedPassword = await bcrypt.hash(newPassword, 12)

      const result = await db.collection("agents").updateOne(
        { id },
        {
          $set: {
            password: hashedPassword,
            updatedAt: new Date().toISOString(),
          },
        },
      )

      return result.modifiedCount > 0
    } catch (error) {
      console.error("Error updating agent password:", error)
      return false
    }
  }

  async createAgent(
    agentData: Omit<Agent, "id" | "createdAt" | "updatedAt" | "propertiesCount" | "_id"> & { rating?: number },
  ): Promise<Agent> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      // Check if email already exists
      const existingAgent = await db.collection("agents").findOne({ email: agentData.email })
      if (existingAgent) {
        throw new Error("Agent with this email already exists")
      }

      const id = await this.getNextSequence("agentId")

      // Hash password if provided
      let hashedPassword = undefined
      if (agentData.password) {
        hashedPassword = await bcrypt.hash(agentData.password, 12)
      }

      const agent: Agent = {
        ...agentData,
        id: id.toString(),
        password: hashedPassword,
        propertiesCount: 0,
        rating: agentData.rating || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.collection("agents").insertOne(agent)

      // Add activity
      await this.addActivity({
        type: "agent_added",
        message: `New agent '${agent.name}' was added`,
        agentId: agent.id,
      })

      return { ...agent, _id: undefined }
    } catch (error) {
      console.error("Error creating agent:", error)
      throw error instanceof Error ? error : new Error("Failed to create agent")
    }
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      // If email is being updated, check for duplicates
      if (updates.email) {
        const existingAgent = await db.collection("agents").findOne({ email: updates.email, id: { $ne: id } })
        if (existingAgent) {
          throw new Error("Agent with this email already exists")
        }
      }

      const updatedAgent = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      const result = await db
        .collection("agents")
        .findOneAndUpdate({ id }, { $set: updatedAgent }, { returnDocument: "after" })

      return result ? ({ ...result, _id: undefined } as Agent) : null
    } catch (error) {
      console.error("Error updating agent:", error)
      return null
    }
  }

  async deleteAgent(id: string): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      // Remove agent from all properties
      await db.collection("properties").updateMany(
        { agentId: id },
        {
          $set: {
            agentId: null,
            agentName: null,
            updatedAt: new Date().toISOString(),
          },
        },
      )

      const result = await db.collection("agents").deleteOne({ id })

      if (result.deletedCount > 0) {
        await this.updateAgentPropertyCounts()
      }

      return result.deletedCount > 0
    } catch (error) {
      console.error("Error deleting agent:", error)
      return false
    }
  }

  // Property methods
  async getProperties(filters?: {
    status?: string
    agentId?: string
    featured?: boolean
    best?: boolean
    priceType?: string
  }): Promise<Property[]> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const query: any = {}

      if (filters?.status) query.status = filters.status
      if (filters?.agentId) query.agentId = filters.agentId
      if (filters?.featured) query.featured = true
      if (filters?.best) query.best = true
      if (filters?.priceType) query.priceType = filters.priceType

      const properties = await db.collection("properties").find(query).sort({ createdAt: -1 }).toArray()
      return properties.map((property) => ({ ...property, _id: undefined })) as Property[]
    } catch (error) {
      console.error("Error fetching properties:", error)
      return []
    }
  }

  async getProperty(id: number): Promise<Property | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const property = await db.collection("properties").findOne({ id })
      return property ? ({ ...property, _id: undefined } as Property) : null
    } catch (error) {
      console.error("Error fetching property:", error)
      return null
    }
  }

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const property = await db.collection("properties").findOne({ slug })
      return property ? ({ ...property, _id: undefined } as Property) : null
    } catch (error) {
      console.error("Error fetching property by slug:", error)
      return null
    }
  }

  async createProperty(propertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "_id">): Promise<Property> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      // Get next unique ID
      const id = await this.getNextSequence("propertyId")

      // Double-check that this ID doesn't exist
      const existingProperty = await db.collection("properties").findOne({ id })
      if (existingProperty) {
        // If it exists, try again with a higher ID
        const properties = await db.collection("properties").find({}).sort({ id: -1 }).limit(1).toArray()
        const nextId = properties.length > 0 ? properties[0].id + 1 : id + 1

        const property: Property = {
          ...propertyData,
          id: nextId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        await db.collection("properties").insertOne(property)
        return { ...property, _id: undefined }
      }

      const property: Property = {
        ...propertyData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.collection("properties").insertOne(property)
      return { ...property, _id: undefined }
    } catch (error) {
      console.error("Error creating property:", error)
      throw new Error("Failed to create property")
    }
  }

  async updateProperty(id: number, updates: Partial<Property>): Promise<Property | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const updatedProperty = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      const result = await db
        .collection("properties")
        .findOneAndUpdate({ id }, { $set: updatedProperty }, { returnDocument: "after" })

      // Update agent property count if agent changed
      if (updates.agentId !== undefined) {
        await this.updateAgentPropertyCounts()
      }

      return result ? ({ ...result, _id: undefined } as Property) : null
    } catch (error) {
      console.error("Error updating property:", error)
      return null
    }
  }

  async deleteProperty(id: number): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const result = await db.collection("properties").deleteOne({ id })

      if (result.deletedCount > 0) {
        await this.updateAgentPropertyCounts()
      }

      return result.deletedCount > 0
    } catch (error) {
      console.error("Error deleting property:", error)
      return false
    }
  }

  async approveProperty(id: number): Promise<Property | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      console.log("Approving property:", id)
      const property = await db.collection("properties").findOne({ id })

      if (!property) {
        console.log("Property not found:", id)
        return null
      }

      if (property.status !== "pending") {
        console.log("Property not in pending status:", property.status)
        return null
      }

      const propertyId = `PR-${String(await this.getNextPropertyNumber()).padStart(4, "0")}`

      const updatedProperty = await this.updateProperty(id, {
        status: "active",
        propertyId,
      })

      if (updatedProperty) {
        await this.addActivity({
          type: "property_approved",
          message: `Property '${updatedProperty.title}' was approved`,
          propertyId: id,
        })
      }

      console.log("Property approved successfully:", updatedProperty)
      return updatedProperty
    } catch (error) {
      console.error("Error approving property:", error)
      return null
    }
  }

  async rejectProperty(id: number): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const property = await db.collection("properties").findOne({ id })

      if (!property || property.status !== "pending") return false

      const updated = await this.updateProperty(id, { status: "rejected" })

      if (updated) {
        await this.addActivity({
          type: "property_rejected",
          message: `Property '${updated.title}' was rejected`,
          propertyId: id,
        })
      }

      return !!updated
    } catch (error) {
      console.error("Error rejecting property:", error)
      return false
    }
  }

  async assignAgentToProperty(propertyId: number, agentId: string): Promise<boolean> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const property = await db.collection("properties").findOne({ id: propertyId })
      const agent = await db.collection("agents").findOne({ id: agentId })

      if (!property || !agent) return false

      await this.updateProperty(propertyId, {
        agentId,
        agentName: agent.name,
      })

      await this.updateAgentPropertyCounts()
      return true
    } catch (error) {
      console.error("Error assigning agent to property:", error)
      return false
    }
  }

  // Update agent property counts
  private async updateAgentPropertyCounts() {
    try {
      const db = await getDatabase()
      const agents = await db.collection("agents").find({}).toArray()

      for (const agent of agents) {
        const propertyCount = await db.collection("properties").countDocuments({ agentId: agent.id })
        await db.collection("agents").updateOne({ id: agent.id }, { $set: { propertiesCount: propertyCount } })
      }
    } catch (error) {
      console.error("Error updating agent property counts:", error)
    }
  }

  // Activity methods
  private async addActivity(activity: Omit<ActivityItem, "id" | "timestamp" | "_id">) {
    try {
      const db = await getDatabase()

      const newActivity: ActivityItem = {
        ...activity,
        id: new ObjectId().toString(),
        timestamp: new Date().toISOString(),
      }

      await db.collection("activities").insertOne(newActivity)

      // Keep only last 50 activities
      const count = await db.collection("activities").countDocuments()
      if (count > 50) {
        const oldActivities = await db
          .collection("activities")
          .find({})
          .sort({ timestamp: 1 })
          .limit(count - 50)
          .toArray()

        const idsToDelete = oldActivities.map((a) => a._id)
        await db.collection("activities").deleteMany({ _id: { $in: idsToDelete } })
      }
    } catch (error) {
      console.error("Error adding activity:", error)
    }
  }

  async getRecentActivities(limit = 10): Promise<ActivityItem[]> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const activities = await db.collection("activities").find({}).sort({ timestamp: -1 }).limit(limit).toArray()

      return activities.map((activity) => ({ ...activity, _id: undefined })) as ActivityItem[]
    } catch (error) {
      console.error("Error fetching activities:", error)
      return []
    }
  }

  // Stats methods
  async getAdminStats(): Promise<AdminStats> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const [
        totalProperties,
        activeProperties,
        pendingProperties,
        totalAgents,
        activeAgents,
        featuredProperties,
        totalContacts,
        newContacts,
        totalBookings,
        pendingBookings,
      ] = await Promise.all([
        db.collection("properties").countDocuments(),
        db.collection("properties").countDocuments({ status: "active" }),
        db.collection("properties").countDocuments({ status: "pending" }),
        db.collection("agents").countDocuments(),
        db.collection("agents").countDocuments({ status: "active" }),
        db.collection("properties").countDocuments({ featured: true }),
        db.collection("contacts").countDocuments(),
        db.collection("contacts").countDocuments({ status: "new" }),
        db.collection("bookings").countDocuments(),
        db.collection("bookings").countDocuments({ status: "pending" }),
      ])

      const recentActivity = await this.getRecentActivities(5)

      return {
        totalProperties,
        activeProperties,
        pendingProperties,
        totalAgents,
        activeAgents,
        featuredProperties,
        totalContacts,
        newContacts,
        totalBookings,
        pendingBookings,
        recentActivity,
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error)
      return {
        totalProperties: 0,
        activeProperties: 0,
        pendingProperties: 0,
        totalAgents: 0,
        activeAgents: 0,
        featuredProperties: 0,
        totalContacts: 0,
        newContacts: 0,
        totalBookings: 0,
        pendingBookings: 0,
        recentActivity: [],
      }
    }
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray()
      return contacts.map((contact) => ({ ...contact, _id: undefined })) as Contact[]
    } catch (error) {
      console.error("Error fetching contacts:", error)
      return []
    }
  }

  async createContact(contactData: Omit<Contact, "id" | "createdAt" | "updatedAt" | "_id">): Promise<Contact> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const contact: Contact = {
        ...contactData,
        id: new ObjectId().toString(),
        status: "new",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.collection("contacts").insertOne(contact)

      await this.addActivity({
        type: "property_approved", // We'll reuse this type for now
        message: `New contact submission from ${contact.name}`,
      })

      return { ...contact, _id: undefined }
    } catch (error) {
      console.error("Error creating contact:", error)
      throw new Error("Failed to create contact")
    }
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const updatedContact = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      const result = await db
        .collection("contacts")
        .findOneAndUpdate({ id }, { $set: updatedContact }, { returnDocument: "after" })

      return result ? ({ ...result, _id: undefined } as Contact) : null
    } catch (error) {
      console.error("Error updating contact:", error)
      return null
    }
  }

  // Booking methods
  async getBookings(): Promise<Booking[]> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      const bookings = await db.collection("bookings").find({}).sort({ createdAt: -1 }).toArray()
      return bookings.map((booking) => ({ ...booking, _id: undefined })) as Booking[]
    } catch (error) {
      console.error("Error fetching bookings:", error)
      return []
    }
  }

  async createBooking(bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt" | "_id">): Promise<Booking> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const booking: Booking = {
        ...bookingData,
        id: new ObjectId().toString(),
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await db.collection("bookings").insertOne(booking)

      await this.addActivity({
        type: "property_approved", // We'll reuse this type for now
        message: `New viewing scheduled for ${booking.propertyTitle} by ${booking.name}`,
      })

      return { ...booking, _id: undefined }
    } catch (error) {
      console.error("Error creating booking:", error)
      throw new Error("Failed to create booking")
    }
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()

      const updatedBooking = {
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      const result = await db
        .collection("bookings")
        .findOneAndUpdate({ id }, { $set: updatedBooking }, { returnDocument: "after" })

      return result ? ({ ...result, _id: undefined } as Booking) : null
    } catch (error) {
      console.error("Error updating booking:", error)
      return null
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const db = await getDatabase()
      await db.admin().ping()
      return true
    } catch (error) {
      console.error("Database health check failed:", error)
      return false
    }
  }

  // Settings methods
  async getSettings(): Promise<SiteSettings> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      let settings = await db.collection("settings").findOne({ id: "global" })
      
      if (!settings) {
        // Create default settings if they don't exist
        const defaultSettings: SiteSettings = {
          id: "global",
          heroBackground: {
            type: "image",
            url: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=2070"
          },
          faqs: [
            { question: "What types of properties do you sell?", answer: "We specialize in modern residential properties, including smart homes, eco-friendly villas, and luxury urban apartments." },
            { question: "How do I know if a property is a good investment?", answer: "We provide comprehensive market analysis and data-driven insights for every property listed on our platform." },
            { question: "Do I need to hire a real estate agent?", answer: "While we facilitate the process, we recommend working with our certified partners to ensure a smooth transaction." },
            { question: "What's the process for buying a property?", answer: "From viewing to closing, we guide you through every legal and financial step with total transparency." }
          ],
          testimonials: [
            {
              name: "Sophia Lorenza",
              role: "CEO of LuxSpace",
              quote: "Working with this team was a pleasure. They understood our vision and helped us find a property that exceeded our expectations. We couldn't have done it without them!",
              image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1974"
            }
          ],
          cta: {
            title: "Ready to Make Your Dream Property a Reality?",
            description: "Connect with our certified experts today to receive customized layout options, off-market pricing lists, and an unparalleled service experience.",
            buttonText: "Get Started",
            buttonLink: "/listings",
            backgroundImage: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&q=80&w=2070",
            secondaryButtonText: "Speak to an Agent",
            secondaryButtonLink: "/contact",
            badgeText: "Curated Living",
            ratingText: "Rated 4.9/5 by Clients"
          },
          propertyTypes: ["House", "Apartment", "Condo", "Villa", "Land"],
          updatedAt: new Date().toISOString()
        }
        await db.collection("settings").insertOne(defaultSettings)
        settings = defaultSettings as any
      }
      
      return { ...settings, _id: undefined } as SiteSettings
    } catch (error) {
      console.error("Error fetching settings:", error)
      // Return a safe default
      return {
        id: "global",
        heroBackground: {
          type: "image",
          url: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?auto=format&fit=crop&q=80&w=2070"
        },
        updatedAt: new Date().toISOString()
      } as SiteSettings
    }
  }

  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings | null> {
    try {
      await this.ensureInitialized()
      const db = await getDatabase()
      
      const updatedSettings = {
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      const result = await db.collection("settings").findOneAndUpdate(
        { id: "global" },
        { $set: updatedSettings },
        { returnDocument: "after", upsert: true }
      )
      
      return result ? { ...result, _id: undefined } as SiteSettings : null
    } catch (error) {
      console.error("Error updating settings:", error)
      return null
    }
  }
}

// Export singleton instance
export const db = new MongoDatabase()
