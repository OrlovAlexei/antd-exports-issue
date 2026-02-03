import { Button } from '@demo/lib';
import type { TooltipPlacement } from '@demo/lib';

export function App() {
	const handleClick = () => {
		console.log('Button clicked');
	};

	return (
		<div>
			<Button type="primary" onClick={handleClick}>
				Click me
			</Button>
		</div>
	);
}

export type { TooltipPlacement };
