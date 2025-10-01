// utils/escalationEngine.js
const EscalationRule = require("../models/EscalationRules.model");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

function compareCondition(ticketValue, operator, value) {
  switch (operator) {
    case "equals": return ticketValue === value;
    case "notEquals": return ticketValue !== value;
    case "greaterThan": return ticketValue > value;
    case "lessThan": return ticketValue < value;
    default: return false;
  }
}

// Evaluate a single rule against a ticket
async function applyRuleToTicket(ticket, rule) {
  const results = rule.conditions.map(cond => {
    let ticketFieldValue;
    if (cond.field === "timeElapsed") {
      ticketFieldValue = Date.now() - new Date(ticket.createdAt).getTime();
    } else {
      ticketFieldValue = ticket[cond.field];
    }
    return compareCondition(ticketFieldValue, cond.operator, cond.value);
  });

  let isTriggered = false;
  if (rule.logicOperator === "AND") isTriggered = results.every(Boolean);
  else if (rule.logicOperator === "OR") isTriggered = results.some(Boolean);

  if (!isTriggered) return false;

  // Apply actions
  for (let action of rule.actions) {
    switch (action.type) {
      case "changeStatus":
        ticket.status = action.value;
        break;
      case "assignDepartment":
        ticket.department = action.value;
        break;
      case "updatePriority":
        ticket.priority = action.value;
        break;
      case "escalateToUser":
        ticket.assignedTo = action.value; // userId
        break;
      case "escalateToRole":
        // assign to first available user with this role
        const user = await User.findOne({ role: action.value, isActive: true });
        if (user) ticket.assignedTo = user._id;
        break;
      case "addReply":
        ticket.replies = ticket.replies || [];
        ticket.replies.push({ message: action.value, createdAt: new Date() });
        break;
    }
  }

  await ticket.save();
  return true;
}

// Run all active rules on a ticket
async function runEscalationRules(ticket) {
  const rules = await EscalationRule.find({ isActive: true });
  for (let rule of rules) {
    await applyRuleToTicket(ticket, rule);
  }
}

module.exports = { runEscalationRules };
