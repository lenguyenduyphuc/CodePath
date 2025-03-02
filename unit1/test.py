
airport_codes = {
    'Houston': 'IAH',
    'Paris': 'CDG',
    'Amsterdam': 'AMS',
    'New York': 'JFK',
    'Seattle': 'SEA'
}

new_airport_codes = {
    'Los Angeles': 'LAX',
    'New York': 'LGA',
    'Minneapolis': 'MSP'
}

print(airport_codes.get('Los Angeles', 'na'))
print(airport_codes.get('New York', 'na'))
airport_codes.update(new_airport_codes)
print(airport_codes.get('Los Angeles', 'na'))
print(airport_codes.get('New York', 'na'))