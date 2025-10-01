const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { logAudit } = require("../utils/audit.logger");
const { runEscalationRules } = require("../utils/escalationEngine");

// Create Ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, department, tags } = req.body;
    if (!title || !department)
      return res.status(400).json({ message: "Title & Department required" });

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      department,
      tags,
      createdBy: req.user._id,
    });

    await logAudit(ticket._id, "CREATE", req.user._id, { title, department });

    await runEscalationRules(ticket);
    res.status(201).json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ticket", error: error.message });
  }
};

// List Tickets
exports.listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tickets", error: error.message });
  }
};

// Get Ticket
exports.getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await logAudit(ticket._id, "VIEW", req.user._id);
    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ticket", error: error.message });
  }
};

// Reply to Ticket
exports.replyToTicket = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.updates = ticket.updates || [];
    ticket.updates.push({ message, user: req.user._id, createdAt: new Date() });
    ticket.updatedAt = new Date();
    await ticket.save();

    await logAudit(ticket._id, "REPLY", req.user._id, { message });

    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error replying to ticket", error: error.message });
  }
};

// Assign Ticket
exports.assignTicket = async (req, res) => {
  try {
    const { agentId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== "agent")
      return res.status(400).json({ message: "Invalid agent" });

    ticket.assignedTo = agent._id;
    ticket.status = "In Progress";
    ticket.updatedAt = new Date();
    await ticket.save();

    await logAudit(ticket._id, "ASSIGN", req.user._id, {
      assignedTo: agent._id,
    });

    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error assigning ticket", error: error.message });
  }
};

// Merge Tickets
exports.mergeTicket = async (req, res) => {
  try {
    const { mergeWithId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    const mergeTicket = await Ticket.findById(mergeWithId);
    if (!ticket || !mergeTicket)
      return res.status(404).json({ message: "Ticket not found" });

    ticket.mergedTickets.push(mergeTicket._id);
    ticket.status = "Merged";
    ticket.updatedAt = new Date();
    await ticket.save();

    await logAudit(ticket._id, "MERGE", req.user._id, {
      mergedWith: mergeTicket._id,
    });

    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error merging tickets", error: error.message });
  }
};

// Close Ticket (with dependency check)
exports.closeTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "dependencies"
    );
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const unresolved = ticket.dependencies.filter((t) => t.status !== "Closed");
    if (unresolved.length > 0) {
      // await logAudit(ticket._id, "CLOSE_BLOCKED", req.user._id, { unresolved });
      return res.status(400).json({
        message: "Cannot close ticket. Unresolved dependencies exist.",
        unresolved: unresolved.map((t) => ({ id: t._id, status: t.status })),
      });
    }

    ticket.status = "Closed";
    ticket.updatedAt = new Date();
    await ticket.save();
    await logAudit(ticket._id, "CLOSE", req.user._id);
    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error closing ticket", error: error.message });
  }
};

// Update Ticket Status
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const oldStatus = ticket.status;
    ticket.status = status;
    ticket.updatedAt = new Date();
    await ticket.save();

    await logAudit(ticket._id, "STATUS_CHANGE", req.user._id, {
      oldStatus,
      newStatus: status,
    });

    await runEscalationRules(ticket);
    res.json(ticket);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ticket status", error: error.message });
  }
};

// Add Dependency
exports.addDependency = async (req, res) => {
  try {
    const { dependencyId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    const dependency = await Ticket.findById(dependencyId);

    if (!ticket || !dependency) {
      return res
        .status(404)
        .json({ message: "Ticket or dependency not found" });
    }
    if (ticket._id.toString() === dependency._id.toString()) {
      return res
        .status(400)
        .json({ message: "A ticket cannot depend on itself" });
    }
    if (!ticket.dependencies.includes(dependency._id)) {
      ticket.dependencies.push(dependency._id);
    }
    if (!dependency.blockedBy.includes(ticket._id)) {
      dependency.blockedBy.push(ticket._id);
    }

    await ticket.save();
    await dependency.save();
    // await logAudit(ticket._id, "ADD_DEPENDENCY", req.user._id, {
    //   dependency: dependency._id,
    // });
    res.json({ message: "Dependency added", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding dependency", error: error.message });
  }
};

// Remove Dependency
exports.removeDependency = async (req, res) => {
  try {
    const { dependencyId } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    const dependency = await Ticket.findById(dependencyId);

    if (!ticket || !dependency) {
      return res
        .status(404)
        .json({ message: "Ticket or dependency not found" });
    }

    ticket.dependencies = ticket.dependencies.filter(
      (id) => id.toString() !== dependencyId
    );
    dependency.blockedBy = dependency.blockedBy.filter(
      (id) => id.toString() !== ticket._id.toString()
    );

    await ticket.save();
    await dependency.save();
    // await logAudit(ticket._id, "REMOVE_DEPENDENCY", req.user._id, {
    //   dependency: dependency._id,
    // });
    res.json({ message: "Dependency removed", ticket });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing dependency", error: error.message });
  }
};
