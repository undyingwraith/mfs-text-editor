import React, {useMemo, useState} from 'react';
import './App.css';
import {MfsEditor} from './MfsEditor';
import {Button, Textarea, Label, Pane, TextInput, toaster} from 'evergreen-ui';

function App() {
	const [currentPath, setCurrentPath] = useState('')
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
			setCurrentPath(path);
		}).catch(e => {
			console.error(e)
			alert(e)
		}).finally(() => {
			setIsWorking(false)
		})
	}

	const writeFile = (saveAs = false) => {
		setIsWorking(true)
		editor.writeFile(saveAs ? path : currentPath, text).then(() => {
			setOriginalText(text);
			toaster.notify('file saved')
		}).catch(e => {
			console.error(e)
			toaster.danger(e)
		}).finally(() => {
			setIsWorking(false)
		})
	}

	return <Pane padding={25}>
		<Pane>
			<TextInput onChange={(e: any) => setPath(e.target.value)} value={path} disabled={isWorking}/>
			<Button marginRight={16}  onClick={loadFile} disabled={isWorking}>Open</Button>
			<Button onClick={() => writeFile()} disabled={isWorking} marginRight={16} appearance="primary">
				Save
			</Button>
			<Button onClick={() => writeFile(true)} disabled={isWorking} marginRight={16}>
				Save as
			</Button>
		</Pane>
		<Pane>
			<Label htmlFor="textarea-2" marginBottom={4} display="block">
				{currentPath}{originalText !== text && '*'}
			</Label>
			<Textarea
				id="textarea-2"
				value={text}
				disabled={isWorking}
				onChange={(e: any) => setText(e.target.value)}
			/>
		</Pane>
	</Pane>;
}

export default App;
