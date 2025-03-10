import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = [
    {
      category: "Car",
      subCategories: [
        {
          subCategory: "Detailing",
          specialties: [
            "Exterior Wash & Dry",
            "Vacuming",
            "Interior Scrubbing & Brushing",
            "Polishing",
            "Sealing or Waxing",
            "Glass Cleaning",
            "Paint Claying",
            "Steam Cleaning",
            "Leather Trimming",
            "Perfuming",
            "Specialized Add-Ons",
            "Paint Correction",
            "Ceramic Coating",
            "Paint Protection Film (PPF)",
            "Window Tint"
          ]
        },
        {
          subCategory: "Oil Change",
          specialties: [
            "Synthetic",
            "Synthetic Blends",
            "High Mileage",
            "Conventional"
          ]
        },
        {
          subCategory: "Repair",
          specialties: [
            "Oil & Filter",
            "Windshield Wipers & Fluid",
            "Air & Cabin Filter",
            "Transmission",
            "Auto Body",
            "Battery Replacement",
            "Auto Glass",
            "Brakes",
            "Coolant",
            "Wheel Balance & Rotation"
          ]
        }
      ]
    },
    {
      category: "Care",
      subCategories: [
        {
          subCategory: "Child",
          specialties: [
            "Cooking/feeding",
            "Light Housekeeping",
            "Laundry",
            "Transporting Kids",
            "Homework",
            "Making Snacks",
            "Playtime"
          ]
        },
        {
          subCategory: "Babysitter",
          specialties: [
            "Cooking/Feeding",
            "Light Housekeeping",
            "Laundry",
            "Changing Diapers",
            "Preparing Bottles",
            "CPR"
          ]
        },
        {
          subCategory: "Nurse",
          specialties: [
          ]
        },
        {
          subCategory: "Elderly",
          specialties: []
        }
      ]
    },
    {
      category: "Cleaning",
      subCategories: [
        {
          subCategory: "Carpet",
          specialties: [
            "Shampooing",
            "Dry",
            "Foam",
            "Steam",
            "Bonnet"
          ]
        },
        {
          subCategory: "Exterior",
          specialties: [
            "Bronze",
            "Cladding",
            "Fascia",
            "Graffiti",
            "Glazing",
            "Gutters",
            "Patio Furniture",
            "Paving",
            "Siding",
            "Stone",
            "Swimming Pools",
            "Solar Panel",
            "Conservatory Roof",
            "Sign",
            "Decking"
          ]
        },
        {
          subCategory: "Interior",
          specialties: [
            "Curtain",
            "Upholstery",
            "Blind",
            "Ceiling and Wall",
            "Laundry",
            "Deep",
            "Basic"
          ]
        },
        {
          subCategory: "Junk",
          specialties: [
            "Electronics (E-waste)",
            "Televisions",
            "Appliances",
            "Tires & Rubber",
            "Bicycles",
            "Household Trash",
            "Carpeting & Rugs",
            "Yard Waste",
            "Renovation Waste",
            "Garbage & Refuse",
            "Furniture",
            "General Rubbish",
            "Hot Tubs",
            "Glass",
            "Mattresses & Box Springs",
            "Exercise Equipment",
            "Refrigerators & Freezers",
            "Pool Tables",
            "Scrap Metals",
            "Pianos"
          ]
        },
        {
          subCategory: "Window",
          specialties: [
            "Hard Water",
            "Glass Doors",
            "Interior Windows",
            "Exterior Windows",
            "Screen"
          ]
        }
      ]
    },
    {
      category: "Creative",
      subCategories: [
        {
          subCategory: "Design",
          specialties: []
        },
        {
          subCategory: "Film",
          specialties: []
        },
        {
          subCategory: "Music",
          specialties: []
        },
        {
          subCategory: "Photo",
          specialties: []
        }
      ]
    },
    {
      category: "Entertainment",
      subCategories: [
        {
          subCategory: "Catering",
          specialties: [
            "Weddings"
          ]
        },
        {
          subCategory: "Event",
          specialties: []
        },
        {
          subCategory: "Kid",
          specialties: []
        },
        {
          subCategory: "Music",
          specialties: [
            "Weddings"
          ]
        },
        {
          subCategory: "Rental",
          specialties: []
        }
      ]
    },
    {
      category: "Finance",
      subCategories: [
        {
          subCategory: "Accountant",
          specialties: [
            "Staff",
            "Certified Public",
            "Investment",
            "Project",
            "Cost",
            "Management",
            "Forensic",
            "Auditor",
            "Finacial Advisor",
            "Finacial Consultant"
          ]
        },
        {
          subCategory: "Credit",
          specialties: [
            "Trade",
            "Bank",
            "Revolving",
            "Open",
            "Installment",
            "Mutual",
            "Service",
          ]
        },
        {
          subCategory: "Investments",
          specialties: [
            "Stocks",
            "Bonds",
            "Mutual Funds & ETFs",
            "Bank Products",
            "Options",
            "Annuities",
            "Retirement",
            "Saving for Education",
            "Alternative & Complex Products",
            "Initial Coin Offerings & Cryptocurrencies",
            "Commodity Futures",
            "Security Futures",
            "Insurance"
          ]
        },
        {
          subCategory: "Navigator",
          specialties: [
            "Oncology"
          ]
        },
        {
          subCategory: "Taxes",
          specialties: [
            "Individual",
            "Business",
            "Tax-Exempt"
          ]
        }
      ]
    },
    {
      category: "Health",
      subCategories: [
        {
          subCategory: "Counseling",
          specialties: []
        },
        {
          subCategory: "Fitness",
          specialties: []
        },
        {
          subCategory: "Massage",
          specialties: []
        },
        {
          subCategory: "Chiropractor",
          specialties: []
        }
      ]
    },
    {
      category: "Home",
      subCategories: [
        {
          subCategory: "Driveways, Patios & Walks",
          specialties: []
        },
        {
          subCategory: "Ducts & Vents",
          specialties: []
        },
        {
          subCategory: "Electrical",
          specialties: []
        },
        {
          subCategory: "HandyMan",
          specialties: []
        },
        {
          subCategory: "Lighting",
          specialties: []
        },
        {
          subCategory: "Paint & Stain",
          specialties: []
        },
        {
          subCategory: "Security & Alarm",
          specialties: []
        },
        {
          subCategory: "House Sitting",
          specialties: []
        }
      ]
    },
    {
      category: "Lawn & Garden",
      subCategories: [
        {
          subCategory: "Hardscaping",
          specialties: []
        },
        {
          subCategory: "Landscaping",
          specialties: []
        },
        {
          subCategory: "Mowing",
          specialties: []
        },
        {
          subCategory: "Snow Removal",
          specialties: []
        },
        {
          subCategory: "Tree & Shrub",
          specialties: []
        }
      ]
    },
    {
      category: "Legal",
      subCategories: []
    },
    {
      category: "Moving & Storage",
      subCategories: [
        {
          subCategory: "Hauling",
          specialties: []
        },
        {
          subCategory: "Moving",
          specialties: []
        },
        {
          subCategory: "Storage",
          specialties: []
        }
      ]
    },
    {
      category: "Personal",
      subCategories: [
        {
          subCategory: "Barber",
          specialties: []
        },
        {
          subCategory: "Hair Stylist",
          specialties: []
        },
        {
          subCategory: "Manicure",
          specialties: []
        },
        {
          subCategory: "Pedicure",
          specialties: []
        },
        {
          subCategory: "Tattoo",
          specialties: []
        },
        {
          subCategory: "Tutor",
          specialties: ["Computer Programming"]
        }
      ]
    },
    {
      category: "Pet & Animal",
      subCategories: [
        {
          subCategory: "Drop-in Visits",
          specialties: [
            "Cat",
            "Dog",
            "Giant",
            "Large",
            "Medium",
            "Small"
          ]
        },
        {
          subCategory: "House Sitting",
          specialties: [
            "Cat",
            "Dog",
            "Giant",
            "Large",
            "Medium",
            "Small"
          ]
        },
        {
          subCategory: "Boarding",
          specialties: [
            "Cat",
            "Dog",
            "Giant",
            "Large",
            "Medium",
            "Small"
          ]
        },
        {
          subCategory: "Pet Sitting",
          specialties: [
            "Cat",
            "Dog",
            "Giant",
            "Large",
            "Medium",
            "Small"
          ]
        },
        {
          subCategory: "Dog Walking",
          specialties: [
            "Cat",
            "Dog",
            "Giant",
            "Large",
            "Medium",
            "Small"
          ]
        },
        {
          subCategory: "Washing & Grooming",
          specialties: [
            "Cat",
            "Dog",
            "Large",
            "Medium",
            "Small",
            "Giant"
          ]
        },
        {
          subCategory: "Aquarium",
          specialties: [
            "Reptiles",
            "Fish"
          ]
        }
      ]
    },
    {
      category: "Real Estate",
      subCategories: [
        {
          subCategory: "Appraisal",
          specialties: []
        },
        {
          subCategory: "Home Inspector",
          specialties: []
        },
        {
          subCategory: "Pest Inspector",
          specialties: []
        },
        {
          subCategory: "Roof Inspector",
          specialties: []
        },
        {
          subCategory: "Waterproofing Inspector",
          specialties: []
        }
      ]
    }
  ]

  getCategories() {
    return this.categories
  }
}
