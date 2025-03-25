import re
import json
import os

def parse_lua_file(file_path):
    # Read the Lua file
    with open(file_path, 'r', encoding='utf-8') as f:
        lua_content = f.read()
    
    # Find all categories
    category_pattern = r'(\w+)={\s*?((?:.|\n)*?)^\s{8}},'
    categories = {}
    
    # Extract the descriptions table content
    descriptions_match = re.search(r'descriptions={((?:.|\n)*?)^\s{4}}', lua_content, re.MULTILINE)
    if descriptions_match:
        descriptions_content = descriptions_match.group(1)
        
        # Find each category
        category_matches = re.finditer(category_pattern, descriptions_content, re.MULTILINE)
        
        for match in category_matches:
            category_name = match.group(1)
            category_content = match.group(2)
            categories[category_name] = parse_category_content(category_content)
    
    return categories

def parse_category_content(content):
    # Pattern to match each item in the category
    item_pattern = r'(\w+)={\s*?((?:.|\n)*?)^\s{12}},'
    items = {}
    
    item_matches = re.finditer(item_pattern, content, re.MULTILINE)
    for match in item_matches:
        item_id = match.group(1)
        item_content = match.group(2)
        items[item_id] = parse_item_content(item_content)
    
    return items

def parse_item_content(content):
    item_data = {}
    
    # Parse name
    name_match = re.search(r'name="(.*?)"', content)
    if name_match:
        item_data['name'] = name_match.group(1)
    
    # Parse text
    text_match = re.search(r'text={\s*?((?:.|\n)*?)^\s{16}}', content, re.MULTILINE)
    if text_match:
        text_content = text_match.group(1)
        text_lines = re.findall(r'"(.*?)"', text_content)
        item_data['text'] = text_lines
    
    # Parse unlock (if exists)
    unlock_match = re.search(r'unlock={\s*?((?:.|\n)*?)^\s{16}}', content, re.MULTILINE)
    if unlock_match:
        unlock_content = unlock_match.group(1)
        unlock_lines = re.findall(r'"(.*?)"', unlock_content)
        item_data['unlock'] = unlock_lines
    
    return item_data

def save_to_json(categories, output_dir):
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Save each category to a separate file
    for category_name, category_data in categories.items():
        output_file = os.path.join(output_dir, f"{category_name}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(category_data, f, indent=2, ensure_ascii=False)
        print(f"Created {output_file}")

def main():
    input_file = "Color formatting discription/en-us.lua"
    output_dir = "Color formatting discription/json_categories"
    
    categories = parse_lua_file(input_file)
    save_to_json(categories, output_dir)
    print(f"Successfully split {len(categories)} categories")

if __name__ == "__main__":
    main() 