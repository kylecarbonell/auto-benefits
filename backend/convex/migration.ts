import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

type BenefitRuleSet = {
	benefitId: string;
	effectiveStart: string;
	effectiveEnd?: string;
	screeningRules: {
		all?: Array<{
			field: string;
			op: "eq" | "neq" | "lte" | "gte" | "lt" | "gt" | "in" | "exists";
			value: unknown;
		}>;
		any?: Array<{
			field: string;
			op: "eq" | "neq" | "lte" | "gte" | "lt" | "gt" | "in" | "exists";
			value: unknown;
		}>;
	};
	incomeLimits?: {
		period: "monthly" | "annual";
		byHouseholdSize: Record<number, number>;
		additionalMemberAmount?: number;
	};
	requiredFollowUps: string[];
	resultLanguage: {
		likely: string;
		possible: string;
		notEnoughInfo: string;
	};
};

const benefitCatalog = {
	calfresh: {
		slug: "calfresh",
		name: "CalFresh",
		state: "CA",
		category: "food" as const,
		description: "California's SNAP food assistance program for low-income households.",
		applicationUrl: "https://benefitscal.com/",
		sourceUrls: ["https://www.cdss.ca.gov/calfresh"]
	},
	medi_cal: {
		slug: "medi_cal",
		name: "Medi-Cal",
		state: "CA",
		category: "healthcare" as const,
		description: "California's Medicaid program providing health coverage.",
		applicationUrl: "https://www.coveredca.com/health/medi-cal/",
		sourceUrls: ["https://www.dhcs.ca.gov/services/medi-cal"]
	},
	wic: {
		slug: "wic",
		name: "California WIC",
		state: "CA",
		category: "family" as const,
		description: "Nutrition support for pregnant, postpartum, breastfeeding people, infants, and young children.",
		applicationUrl: "https://myfamily.wic.ca.gov/",
		sourceUrls: ["https://www.cdph.ca.gov/Programs/CFH/DWICSN"]
	},
	california_lifeline: {
		slug: "california_lifeline",
		name: "California LifeLine",
		state: "CA",
		category: "phone" as const,
		description: "Discounted home or mobile phone service for eligible California households.",
		applicationUrl: "https://www.californialifeline.com/",
		sourceUrls: ["https://www.californialifeline.com/"]
	},
	liheap_ca: {
		slug: "liheap_ca",
		name: "LIHEAP California",
		state: "CA",
		category: "utility" as const,
		description: "Energy bill and weatherization assistance for income-eligible households in California.",
		applicationUrl: "https://www.csd.ca.gov/Pages/LIHEAPProgram.aspx",
		sourceUrls: ["https://www.csd.ca.gov/Pages/LIHEAPProgram.aspx"]
	}
};

const benefitRuleSets: BenefitRuleSet[] = [
	{
		benefitId: "calfresh",
		effectiveStart: "2025-10-01",
		effectiveEnd: "2026-09-30",
		screeningRules: {
			all: [
				{ field: "state", op: "eq", value: "CA" },
				{ field: "householdSize", op: "exists", value: true },
				{ field: "monthlyIncome", op: "exists", value: true }
			]
		},
		incomeLimits: {
			period: "monthly",
			byHouseholdSize: {
				1: 2610,
				2: 3526,
				3: 4442,
				4: 5360,
				5: 6276,
				6: 7192,
				7: 8110,
				8: 9026
			}
		},
		requiredFollowUps: [
			"citizenship_or_eligible_immigration_status",
			"elderly_or_disabled_household_member",
			"rent_or_mortgage_cost",
			"utility_costs",
			"childcare_costs",
			"student_status"
		],
		resultLanguage: {
			likely: "You may be a strong CalFresh match based on household size and income.",
			possible: "CalFresh may be worth applying for, but more details are needed.",
			notEnoughInfo: "We need household, income, and expense details to screen for CalFresh."
		}
	},
	{
		benefitId: "medi_cal",
		effectiveStart: "2025-01-01",
		screeningRules: {
			all: [
				{ field: "state", op: "eq", value: "CA" },
				{ field: "householdSize", op: "exists", value: true },
				{ field: "annualIncome", op: "exists", value: true }
			]
		},
		incomeLimits: {
			period: "annual",
			byHouseholdSize: {
				1: 21597,
				2: 29187,
				3: 36777,
				4: 44367,
				5: 51957,
				6: 59547,
				7: 67137,
				8: 74727
			},
			additionalMemberAmount: 7590
		},
		requiredFollowUps: [
			"age",
			"pregnancy_status",
			"disability_status",
			"current_health_insurance",
			"immigration_status"
		],
		resultLanguage: {
			likely: "You may qualify for Medi-Cal based on income and household size.",
			possible: "You may qualify for Medi-Cal or another California health coverage pathway.",
			notEnoughInfo: "We need income, household size, age, and coverage details."
		}
	},
	{
		benefitId: "wic",
		effectiveStart: "2025-04-01",
		effectiveEnd: "2026-06-30",
		screeningRules: {
			all: [
				{ field: "state", op: "eq", value: "CA" },
				{ field: "householdSize", op: "exists", value: true },
				{ field: "monthlyIncome", op: "exists", value: true }
			],
			any: [
				{ field: "pregnancyStatus", op: "eq", value: true },
				{ field: "hasInfant", op: "eq", value: true },
				{ field: "hasChildUnderFive", op: "eq", value: true }
			]
		},
		incomeLimits: {
			period: "monthly",
			byHouseholdSize: {
				1: 2413,
				2: 3261,
				3: 4109,
				4: 4957,
				5: 5805,
				6: 6653,
				7: 7501,
				8: 8349
			},
			additionalMemberAmount: 848
		},
		requiredFollowUps: [
			"pregnancy_status",
			"has_child_under_5",
			"has_infant",
			"breastfeeding_or_postpartum_status",
			"nutrition_risk_assessment"
		],
		resultLanguage: {
			likely: "Your household may meet WIC income screening, but WIC also requires pregnancy, infant, or young child status.",
			possible: "WIC may be possible if someone in the household is pregnant, postpartum, breastfeeding, an infant, or under age 5.",
			notEnoughInfo: "We need to know whether the household includes a pregnant person, infant, or child under 5."
		}
	},
	{
		benefitId: "california_lifeline",
		effectiveStart: "2025-06-01",
		effectiveEnd: "2026-05-31",
		screeningRules: {
			all: [
				{ field: "state", op: "eq", value: "CA" },
				{ field: "householdSize", op: "exists", value: true }
			],
			any: [
				{ field: "annualIncome", op: "exists", value: true },
				{ field: "receivesCalFresh", op: "eq", value: true },
				{ field: "receivesMediCal", op: "eq", value: true },
				{ field: "receivesSSI", op: "eq", value: true },
				{ field: "receivesWIC", op: "eq", value: true },
				{ field: "receivesLIHEAP", op: "eq", value: true }
			]
		},
		incomeLimits: {
			period: "annual",
			byHouseholdSize: {
				1: 24200,
				2: 32600,
				3: 41100,
				4: 49600,
				5: 58100,
				6: 66600,
				7: 75100,
				8: 83600,
				9: 92100,
				10: 100600
			},
			additionalMemberAmount: 8500
		},
		requiredFollowUps: [
			"current_public_benefits",
			"annual_income",
			"has_existing_lifeline_line"
		],
		resultLanguage: {
			likely: "You may qualify for California LifeLine by income or participation in another benefit program.",
			possible: "California LifeLine may be available if you meet income limits or already receive a qualifying benefit.",
			notEnoughInfo: "We need either income or current benefit participation."
		}
	},
	{
		benefitId: "liheap_ca",
		effectiveStart: "2025-10-01",
		effectiveEnd: "2026-09-30",
		screeningRules: {
			all: [
				{ field: "state", op: "eq", value: "CA" },
				{ field: "householdSize", op: "exists", value: true },
				{ field: "monthlyIncome", op: "exists", value: true }
			]
		},
		incomeLimits: {
			period: "monthly",
			byHouseholdSize: {
				1: 3331.66,
				2: 4356.83,
				3: 5382.0,
				4: 6407.16,
				5: 7432.25,
				6: 8457.41,
				7: 8649.66,
				8: 8841.83,
				9: 9034.08,
				10: 9226.25
			},
			additionalMemberAmount: 192.21
		},
		requiredFollowUps: [
			"utility_provider",
			"energy_bill_amount",
			"behind_on_utility_bill",
			"disconnect_notice",
			"county_or_zip_code"
		],
		resultLanguage: {
			likely: "You may meet LIHEAP income screening and should contact your local energy assistance provider.",
			possible: "LIHEAP may be possible, but services vary by local agency and energy situation.",
			notEnoughInfo: "We need income, household size, and utility situation."
		}
	}
];

export const seedBenefitsAndRules = mutation({
	args: {},
	handler: async (ctx) => {
		const now = Date.now();
		const benefitIdsBySlug = new Map<string, string>();

		for (const [slug, benefit] of Object.entries(benefitCatalog)) {
			const existing = await ctx.db
				.query("benefits")
				.withIndex("by_slug", (q) => q.eq("slug", slug))
				.unique();

			if (existing) {
				benefitIdsBySlug.set(slug, existing._id);
				continue;
			}

			const insertedId = await ctx.db.insert("benefits", {
				...benefit,
				active: true,
				createdAt: now,
				updatedAt: now
			});

			benefitIdsBySlug.set(slug, insertedId);
		}

		for (const ruleSet of benefitRuleSets) {
			const benefitId = benefitIdsBySlug.get(ruleSet.benefitId);

			if (!benefitId) {
				throw new Error(`Missing benefit record for slug: ${ruleSet.benefitId}`);
			}

			const existingRules = await ctx.db
				.query("benefitRules")
				.withIndex("by_benefit", (q) => q.eq("benefitId", benefitId))
				.collect();

			const alreadyExists = existingRules.some(
				(rule) =>
					rule.effectiveStart === ruleSet.effectiveStart &&
					rule.effectiveEnd === ruleSet.effectiveEnd
			);

			if (alreadyExists) {
				continue;
			}

			await ctx.db.insert("benefitRules", {
				benefitId: benefitId as Id<"benefits">,
				effectiveStart: ruleSet.effectiveStart,
				effectiveEnd: ruleSet.effectiveEnd,
				screeningRules: {
					all: ruleSet.screeningRules.all,
					any: ruleSet.screeningRules.any
				},
				incomeLimits: ruleSet.incomeLimits
					? {
							period: ruleSet.incomeLimits.period,
							byHouseholdSize: Object.entries(ruleSet.incomeLimits.byHouseholdSize).map(
								([householdSize, amount]) => ({
									householdSize: Number(householdSize),
									amount
								})
							),
							additionalMemberAmount: ruleSet.incomeLimits.additionalMemberAmount
						}
					: undefined,
				requiredFollowUps: ruleSet.requiredFollowUps,
				resultLanguage: ruleSet.resultLanguage,
				sourceUrls: benefitCatalog[ruleSet.benefitId as keyof typeof benefitCatalog].sourceUrls,
				lastVerifiedAt: ruleSet.effectiveStart,
				active: true,
				createdAt: now,
				updatedAt: now
			});
		}

		return {
			success: true,
			seededBenefits: Object.keys(benefitCatalog).length,
			seededRuleSets: benefitRuleSets.length
		};
	}
});
