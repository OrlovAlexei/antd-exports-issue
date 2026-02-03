import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { App } from './App';

describe('App', () => {
	it("render",()=>{
		render(<App/>)
	})
	it('should import library that re-exports antd - THIS DEMONSTRATES THE EXPORTS FIELD ISSUE', async () => {
		// Этот тест демонстрирует проблему с разрешением модулей antd
		// когда библиотека реэкспортирует antd и типы из antd/es/tooltip
		// При использовании Yarn PnP возникает ошибка из-за отсутствия поля exports в antd
		//
		// Проблема проявляется когда vite/vitest пытается разрешить модуль библиотеки
		// и видит импорт antd/es/tooltip в .d.ts файле библиотеки
		// Без поля exports в antd, Yarn PnP не может правильно разрешить этот путь
		//
		// Ожидаемая ошибка:
		// Error: Failed to resolve entry for package "@demo/lib"
		// или ошибка связанная с разрешением antd/es/tooltip
		// или ошибка peer dependency (которая также связана с проблемой разрешения модулей)
		try {
			const libModule = await import('@demo/lib');
			// Если модуль загрузился, проверяем что он определен
			expect(libModule).toBeDefined();
			expect(libModule.Button).toBeDefined();
		} catch (error: any) {
			// Ожидаем ошибку разрешения модуля из-за проблемы с antd/es/tooltip
			// или peer dependency (которая также связана с проблемой разрешения)
			const errorMessage = error.message || '';
			if (errorMessage.includes('Failed to resolve entry') ||
			    errorMessage.includes('Qualified path resolution failed') ||
			    errorMessage.includes('antd/es/tooltip') ||
			    errorMessage.includes('exports') ||
			    errorMessage.includes('peer dependency')) {
				// Это и есть проблема, которую мы демонстрируем
				// Проблема может проявляться как ошибка разрешения entry point
				// или как ошибка peer dependency из-за неправильного разрешения модулей
				throw new Error(
					`Module resolution failed. This demonstrates the issue with missing exports field in antd. ` +
					`Original error: ${errorMessage}`
				);
			}
			throw error;
		}
	});
});
