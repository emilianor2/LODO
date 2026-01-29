
import random
import uuid
import json

# Taxonomies (V1)
TAXONOMIES = {
    "organizationType": ["Startup", "Investor", "Hub", "Accelerator", "Corporate", "University", "Government", "NGO", "Research Center", "Service Provider", "Other"],
    "sectorPrimary": ["AgTech", "FoodTech", "ClimateTech", "BioTech", "WaterTech", "EnergyTech", "SupplyChain/Logistics", "FinTech", "IoT/Hardware", "CircularEconomy", "Other"],
    "stage": ["Pre-seed", "Seed", "Series A", "Series B+", "Growth", "Scale", "Unknown"],
    "outcomeStatus": ["Active", "Acquired", "Closed", "Merged", "Stealth", "Unknown"],
    "technology": ["AI/ML", "IoT", "Blockchain", "Robotics", "Drones", "SaaS", "Sensors", "Satellite/Remote Sensing", "Analytics", "Automation", "Biotech", "Other"],
    "impactArea": ["Carbon", "Water", "Soil", "Biodiversity", "Waste", "FoodSecurity", "EnergyEfficiency", "Traceability", "Inclusion", "Other"],
    "badge": ["Verified", "Featured", "Partner", "TopStartup", "HighImpact"]
}

COUNTRIES = [
    {"name": "Argentina", "cities": [("Buenos Aires", -34.6037, -58.3816), ("Cordoba", -31.4201, -64.1888), ("Rosario", -32.9442, -60.6505), ("Mendoza", -32.8895, -68.8458)]},
    {"name": "Brazil", "cities": [("Sao Paulo", -23.5505, -46.6333), ("Rio de Janeiro", -22.9068, -43.1729), ("Florianopolis", -27.5954, -48.5480)]},
    {"name": "Chile", "cities": [("Santiago", -33.4489, -70.6693), ("Valparaiso", -33.0472, -71.6127)]},
    {"name": "Colombia", "cities": [("Bogota", 4.7110, -74.0721), ("Medellin", 6.2442, -75.5812)]},
    {"name": "Mexico", "cities": [("Mexico City", 19.4326, -99.1332), ("Guadalajara", 20.6597, -103.3496)]},
    {"name": "USA", "cities": [("San Francisco", 37.7749, -122.4194), ("New York", 40.7128, -74.0060), ("Austin", 30.2672, -97.7431)]},
    {"name": "Spain", "cities": [("Madrid", 40.4168, -3.7038), ("Barcelona", 41.3851, 2.1734)]},
    {"name": "United Kingdom", "cities": [("London", 51.5074, -0.1278), ("Manchester", 53.4808, -2.2426)]},
    {"name": "Germany", "cities": [("Berlin", 52.5200, 13.4050), ("Munich", 48.1351, 11.5820)]},
    {"name": "Israel", "cities": [("Tel Aviv", 32.0853, 34.7818)]}
]

PREFIXES = ["Tech", "Global", "Smart", "Eco", "Future", "Green", "Agro", "Bio", "Data", "Open", "Net", "Cloud", "Blue", "Red", "Alpha", "Omega"]
SUFFIXES = ["Solutions", "Systems", "Labs", "Hub", "Works", "Dynamics", "Innovations", "Ventures", "Partners", "Group", "IO", "AI", "Robotics", "Energy"]

def generate_sql():
    sql_statements = []
    
    # Header
    sql_statements.append("-- Seed 100 Organizations across different countries")
    
    for i in range(1, 101):
        country_data = random.choice(COUNTRIES)
        city_data = random.choice(country_data["cities"])
        city_name = city_data[0]
        base_lat = city_data[1]
        base_lng = city_data[2]
        
        # Jitter coordinates slightly
        lat = base_lat + random.uniform(-0.05, 0.05)
        lng = base_lng + random.uniform(-0.05, 0.05)
        
        name = f"{random.choice(PREFIXES)} {random.choice(SUFFIXES)} {i}"
        slug = name.lower().replace(" ", "-") + f"-{i}"
        # truncate slug to ensure it fits CHAR(36) if mostly intended for UUIDs, but here we use slugs.
        # However, checking schema: id is CHAR(36). Slugs longer than 36 will fail.
        # Let's generate a UUID instead to be safe, or keeps slugs very short.
        # Previous turn used slugs like 'mercadolibre-ar'. That is < 36.
        # 'tech-solutions-100' is 18 chars. It fits.
        if len(slug) > 36:
             slug = slug[:36]
        
        org_type = random.choice(TAXONOMIES["organizationType"])
        sector = random.choice(TAXONOMIES["sectorPrimary"])
        
        # stage logic
        stage = random.choice(TAXONOMIES["stage"])
        if org_type != "Startup" and random.random() > 0.3:
             stage = None
        
        outcome = random.choice(TAXONOMIES["outcomeStatus"])
        
        # multiples
        techs = random.sample(TAXONOMIES["technology"], k=random.randint(0, 3))
        impacts = random.sample(TAXONOMIES["impactArea"], k=random.randint(1, 3))
        badges = []
        if random.random() > 0.7:
             badges = random.sample(TAXONOMIES["badge"], k=random.randint(1, 2))
             
        tags = [f"Tag{x}" for x in range(random.randint(0, 3))]
        
        description = f"Innovative {sector} solution helping {country_data['name']} market."
        
        # SQL Escape helper (very basic)
        def esc(s):
             if s is None: return "NULL"
             return "'" + str(s).replace("'", "''") + "'"

        def json_esc(l):
             if not l: return "NULL"
             return "'" + json.dumps(l) + "'"

        sql = f"""INSERT INTO organizations (
            id, name, organization_type, sector_primary, sector_secondary,
            stage, outcome_status, country, region, city,
            lat, lng, website, notes, status,
            description, year_founded, logo_url, linkedin_url, contact_email,
            contact_phone, instagram_url, tags_json, technology_json,
            impact_area_json, badge_json
        ) VALUES (
            {esc(slug)}, {esc(name)}, {esc(org_type)}, {esc(sector)}, NULL,
            {esc(stage)}, {esc(outcome)}, {esc(country_data['name'])}, {esc('Region ' + city_name)}, {esc(city_name)},
            {lat}, {lng}, {esc('https://example.com')}, {esc('Auto-generated seed')}, 'PUBLISHED',
            {esc(description)}, {random.randint(2010, 2025)}, NULL, NULL, {esc('contact@example.com')},
            NULL, NULL, {json_esc(tags)}, {json_esc(techs)},
            {json_esc(impacts)}, {json_esc(badges)}
        );"""
        
        sql_statements.append(sql)

    return "\n".join(sql_statements)

if __name__ == "__main__":
    print(generate_sql())
