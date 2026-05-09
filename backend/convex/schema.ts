import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const users = defineTable({
  name: v.string(),
  email: v.string(),
}).index("by_email", ["email"]);

const profiles = defineTable({
  userId: v.id("users"),

  state: v.string(),
  householdSize: v.number(),

  // Store normalized income separately from the UI label.
  monthlyIncomeMin: v.optional(v.number()),
  monthlyIncomeMax: v.optional(v.number()),
  annualIncomeMin: v.optional(v.number()),
  annualIncomeMax: v.optional(v.number()),

  employmentStatus: v.optional(v.string()),

  // Follow-up fields you will collect later.
  age: v.optional(v.number()),
  hasChildrenUnder18: v.optional(v.boolean()),
  hasChildUnder5: v.optional(v.boolean()),
  pregnancyStatus: v.optional(v.boolean()),
  disabilityStatus: v.optional(v.boolean()),
  veteranStatus: v.optional(v.boolean()),
  studentStatus: v.optional(v.boolean()),

  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_user", ["userId"]);

const benefits = defineTable({
  slug: v.string(), // "calfresh", "medi_cal", etc.
  name: v.string(),
  state: v.string(),

  category: v.union(
    v.literal("food"),
    v.literal("healthcare"),
    v.literal("family"),
    v.literal("phone"),
    v.literal("utility")
  ),

  description: v.string(),
  applicationUrl: v.string(),
  sourceUrls: v.array(v.string()),

  active: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_state", ["state"])
  .index("by_category", ["category"]);

const rule = v.object({
  field: v.string(),
  op: v.union(
    v.literal("eq"),
    v.literal("neq"),
    v.literal("lte"),
    v.literal("gte"),
    v.literal("lt"),
    v.literal("gt"),
    v.literal("in"),
    v.literal("exists")
  ),
  value: v.any(),
});

const benefitRules = defineTable({
  benefitId: v.id("benefits"),

  effectiveStart: v.string(), // "2025-10-01"
  effectiveEnd: v.optional(v.string()),

  screeningRules: v.object({
    all: v.optional(v.array(rule)),
    any: v.optional(v.array(rule)),
  }),

  incomeLimits: v.optional(
    v.object({
      period: v.union(v.literal("monthly"), v.literal("annual")),
      byHouseholdSize: v.array(
        v.object({
          householdSize: v.number(),
          amount: v.number(),
        })
      ),
      additionalMemberAmount: v.optional(v.number()),
    })
  ),

  requiredFollowUps: v.array(v.string()),

  resultLanguage: v.object({
    likely: v.string(),
    possible: v.string(),
    notEnoughInfo: v.string(),
  }),

  sourceUrls: v.array(v.string()),
  lastVerifiedAt: v.string(),

  active: v.boolean(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_benefit", ["benefitId"])
  .index("by_active", ["active"]);

const benefitMatches = defineTable({
  userId: v.id("users"),
  profileId: v.id("profiles"),
  benefitId: v.id("benefits"),

  status: v.union(
    v.literal("likely"),
    v.literal("possible"),
    v.literal("not_eligible"),
    v.literal("not_enough_info")
  ),

  confidence: v.number(),

  matchedReasons: v.array(v.string()),
  missingFields: v.array(v.string()),

  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_profile", ["profileId"])
  .index("by_benefit", ["benefitId"]);

export default defineSchema({
  users,
  profiles,
  benefits,
  benefitRules,
  benefitMatches,
});
