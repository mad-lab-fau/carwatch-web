
export function cssVariables(node: any, variables: any) {
	setCssVariables(node, variables);

	return {
		update(variables: any) {
			setCssVariables(node, variables);
		}
	};
}
export function setCssVariables(node: any, variables: any) {
	for (const name in variables) {
		node.style.setProperty(`--${name}`, variables[name]);
	}
}