import json
import os

# Read the consolidated data file
try:
    with open('consolidated_balatro_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    # Create a directory for the split files if it doesn't exist
    output_dir = 'categories'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Extract each category into its own file
    for category, category_data in data.items():
        output_path = os.path.join(output_dir, f'{category}.json')
        
        # Create an object with just this category
        category_object = {
            category: category_data
        }
        
        # Write to file with pretty formatting
        with open(output_path, 'w', encoding='utf-8') as output_file:
            json.dump(category_object, output_file, indent=2, ensure_ascii=False)
        
        print(f"Created {output_path}")
    
    print("All categories have been split successfully!")
except Exception as e:
    print(f"Error processing file: {e}") 