const EscalationRule = require("../models/rule.model");
const Ticket = require("../models/ticket.model");
const Department = require("../models/department.model");
const Status = require("../models/status.model");
const Audit = require("../models/audit.model");

function opEval(operator, left, right) {
  // nearest minimal supported operations
  switch (operator) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "in":
      return Array.isArray(right) ? right.includes(left) : false;
    case "gt":
      return left > right;
    case "lt":
      return left < right;
    case "gte":
      return left >= right;
    case "lte":
      return left <= right;
    default:
      return false;
  }
}

async function evaluateRulesForTicket(ticketId) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) return;
  const rules = await EscalationRule.find({ active: true });
  for (const rule of rules) {
    const results = rule.conditions.map((cond) => {
      const left = getFieldValue(ticket, cond.field);
      return opEval(cond.operator, left, cond.value);
    });
    const match =
      rule.logic === "AND" ? results.every(Boolean) : results.some(Boolean);
    if (match) {
      await applyActions(rule.actions, ticket, rule);
    }
  }
}

function getFieldValue(ticket, field) {
  // support dot notation
  return field.split(".").reduce((acc, p) => acc && acc[p], ticket);
}

async function applyActions(actions, ticket, rule) {
  for (const action of actions) {
    switch (action.type) {
      case "assign_department":
        ticket.department = action.payload.departmentId;
        await Audit.create({
          ticketId: ticket._id,
          action: "rule_assign_department",
          performedBy: null,
          meta: { rule: rule._id },
        });
        break;
      case "change_status":
        ticket.status = action.payload.statusId;
        await Audit.create({
          ticketId: ticket._id,
          action: "rule_change_status",
          performedBy: null,
          meta: { rule: rule._id },
        });
        break;
      case "update_priority":
        ticket.priority = action.payload.priority;
        await Audit.create({
          ticketId: ticket._id,
          action: "rule_update_priority",
          performedBy: null,
          meta: { rule: rule._id },
        });
        break;
      case "escalate_user":
        ticket.assignedTo = action.payload.userId;
        await Audit.create({
          ticketId: ticket._id,
          action: "rule_escalate_user",
          performedBy: null,
          meta: { rule: rule._id },
        });
        break;
      case "add_reply":
        ticket.replies.push({
          author: null,
          message: action.payload.message,
          internal: true,
        });
        await Audit.create({
          ticketId: ticket._id,
          action: "rule_add_reply",
          performedBy: null,
          meta: { rule: rule._id },
        });
        break;
      default:
        // unknown action
        break;
    }
  }
  ticket.lastUpdatedAt = new Date();
  await ticket.save();
}

module.exports = { evaluateRulesForTicket };
