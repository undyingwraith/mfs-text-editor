import React, {useMemo, useState} from 'react';
import './App.css';
import {MfsEditor} from './MfsEditor';

function App() {
	const [path, setPath] = useState('/')
	const [text, setText] = useState('')
	const [originalText, setOriginalText] = useState('')
	const [isWorking, setIsWorking] = useState(false)
	const editor = useMemo(() => new MfsEditor(), [])

	const loadFile = () => {
		setIsWorking(true)
		editor.readFile(path).then(text => {
			setText(text);
			setOriginalText(text);
		}).catch(e => {
			console.error(e)
			alert(e)
		}).finally(() => {
			setIsWorking(false)
		})
	}

	const writeFile = () => {
		setIsWorking(true)
		editor.writeFile(path, text).then(() => {
			setOriginalText(text);
			alert('file saved')
		}).catch(e => {
			console.error(e)
			alert(e)
		}).finally(() => {
			setIsWorking(false)
		})
	}

	return <>
		<header>
			<input value={path} onChange={(e) => setPath(e.target.value)} disabled={isWorking} size={250}/>
			<button onClick={loadFile} disabled={isWorking}>Open</button>
			<button onClick={writeFile} disabled={isWorking}>Save</button>
		</header>
		<div>
			changed: {(text !== originalText) + ""}
			{isWorking && '| Working...'}
		</div>
		<main><textarea onChange={(e) => setText(e.target.value)} value={text} disabled={isWorking}/></main>
	</>;
}

export default App;
