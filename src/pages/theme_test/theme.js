import { createRef, isValidElement, useEffect } from "react";
import ReactDOM from "react-dom/client";


function applyTheme(container, layout, params = {}) {
	if (typeof container == "undefined") return container;
	if (typeof container.current !== "undefined") container = container.current;
	if (typeof container.innerHTML === "undefined") {
		console.error("Container given was not a HTML Element", container);
		return container;
	}
	container.innerHTML = layout;

	const components = Object.entries(params).filter(([paramName, paramValue]) => isValidElement(paramValue)),
		variables = Object.entries(params).filter(([paramName, paramValue]) => !isValidElement(paramValue));

	for (const [param, value] of variables) {
		//container.innerHTML = container.innerHTML.split("");

		const regex = new RegExp(`{{${param}}}`, 'g');
		container.innerHTML = container.innerHTML.replace(regex, value);
		if (container.querySelector([param])) {
			components.push([
				param,
				<>{value}</>
			]);
		}
	}

	for (const [param, component] of components) {
		let elements = container.querySelectorAll([param]);
		for (const element of elements)
			if (typeof element !== "undefined") {
				const root = ReactDOM.createRoot(element);
				root.render(component);
			}
	}
}

function Cheese() {
	return <p>🧀 Cheese</p>;
}


function ThemeTest() {

	const hello = createRef();

	const TEST_THEME = {
		test: `<div>
		<h1>Hello World</h1>
		<p>Price: £ {{price}}</p>
		<cheese></cheese>

		<p>This should work: <price/></p>
		<p>This shouldn't work: {{cheese}}</p>

	</div>`
	};

	useEffect(() => {
		applyTheme(hello, TEST_THEME.test, { price: 1.75, cheese: <Cheese /> });

	});



	return <>
		<p>test</p>
		<span ref={hello} />
	</>;
}


ThemeTest.url = "/theme-test";
export default ThemeTest;;
