from dataclasses import dataclass
from typing import List, Dict, Union
from flask import Flask, request, jsonify
import re

# ==== Type Definitions, feel free to add or modify ===========================
@dataclass
class CookbookEntry:
	name: str

@dataclass
class RequiredItem():
	name: str
	quantity: int

@dataclass
class Recipe(CookbookEntry):
	required_items: List[RequiredItem]

@dataclass
class Ingredient(CookbookEntry):
	cook_time: int


# =============================================================================
# ==== HTTP Endpoint Stubs ====================================================
# =============================================================================
app = Flask(__name__)

# Store your recipes here!
cookbook = {}

# Task 1 helper (don't touch)
@app.route("/parse", methods=['POST'])
def parse():
	data = request.get_json()
	recipe_name = data.get('input', '')
	parsed_name = parse_handwriting(recipe_name)
	if parsed_name is None:
		return 'Invalid recipe name', 400
	return jsonify({'msg': parsed_name}), 200

# [TASK 1] ====================================================================
# Takes in a recipeName and returns it in a form that 
def parse_handwriting(recipeName: str) -> Union[str | None]:
	# Replace separators with spaces
	recipeName = recipeName.replace('-', ' ').replace('_', ' ')

	# regex remove all non letters and non spaces
	recipeName = re.sub(r'[^a-zA-Z\s]', '', recipeName)

	# bring them into a list, capitalise, then join with singular whitespaces
	words = [w.capitalize() for w in recipeName.split()]
	return " ".join(words) if words else None


# [TASK 2] ====================================================================
# Endpoint that adds a CookbookEntry to your magical cookbook
@app.route('/entry', methods=['POST'])
def create_entry():
	data = request.get_json()
	name = data.get('name')
	type = data.get('type')

	# Check if entry name is unique
	if name in cookbook:
		return 'Entry name must be unique', 400

	if type == 'ingredient':
		# check cookTime
		cook_time = data.get('cookTime')
		if not isinstance(cook_time, int) or cook_time < 0:
			return 'Invalid cookTime', 400
		# Create and store ingredient
		cookbook[name] = Ingredient(name, cook_time)

	elif type == 'recipe':
		required_items = []
		seen_items = set()
		# validation
		for item in data.get('requiredItems', []):
			item_name = item.get('name')
			if item_name in seen_items:
				return 'Duplicate required item', 400
			seen_items.add(item_name)
			required_items.append(RequiredItem(item_name, item.get('quantity')))
		# recipe creation + storing
		cookbook[name] = Recipe(name, required_items)

	else:
		return 'Invalid type', 400

	return '', 200

# [TASK 3] ====================================================================
# Endpoint that returns a summary of a recipe that corresponds to a query name
@app.route('/summary', methods=['GET'])
def summary():
	name = request.args.get('name')

	if name not in cookbook:
		return 'Recipe not found', 400

	entry = cookbook[name]
	if not isinstance(entry, Recipe):
		return 'Entry is not a recipe', 400

	total_cook_time = 0
	base_ingredients = {}
	items = [(item.name, item.quantity) for item in entry.required_items]

	# stack used for iterative imitation of recursion, seems simpler in my head
	while items:
		item_name, qty = items.pop()
		if item_name not in cookbook:
			return 'Recipe contains missing ingredients', 400

		item = cookbook[item_name]
		if isinstance(item, Ingredient):
			total_cook_time += item.cook_time * qty
			base_ingredients[item_name] = base_ingredients.get(item_name, 0) + qty
		else:
			items.extend([(req.name, req.quantity * qty) for req in item.required_items]) # if its a recipe, then add it to the stack

	return jsonify({
		"name": name,
		"cookTime": total_cook_time,
		"ingredients": [{"name": k, "quantity": v} for k, v in base_ingredients.items()]
	}), 200


# =============================================================================
# ==== DO NOT TOUCH ===========================================================
# =============================================================================

if __name__ == '__main__':
	app.run(debug=True, port=8080)
