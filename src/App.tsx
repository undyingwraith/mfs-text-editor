import React, {useEffect, useMemo, useState} from 'react';
import './App.css';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/3024-night.css'
import {MfsEditor} from './MfsEditor';
import {Button, Textarea, Label, Pane, TextInput, toaster} from 'evergreen-ui';
import CodeMirror, {EditorFromTextArea} from 'codemirror';

function App() {
	const [currentPath, setCurrentPath] = useState('')
	const [path, setPath] = useState('/')
	const [originalText, setOriginalText] = useState('')
	const [isWorking, setIsWorking] = useState(false)
	const [editor, setEditor] = useState<EditorFromTextArea | undefined>()
	const mfsEditor = useMemo(() => new MfsEditor(), [])

	useEffect(() => {
		const editor = CodeMirror.fromTextArea(document.getElementById('textarea-2') as HTMLTextAreaElement, {
			lineNumbers: true,
			theme: '3024-night',
		});
		setEditor(editor)
	}, [])

	const loadFile = () => {
		setIsWorking(true)
		mfsEditor.readFile(path).then(text => {
			editor?.setValue(text)
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
		const text = editor?.getValue() ?? ''
		setIsWorking(true)
		mfsEditor.writeFile(saveAs ? path : currentPath, text).then(() => {
			setOriginalText(text);
			if(saveAs) {
				setCurrentPath(path)
			}
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
			<Button onClick={() => writeFile()} disabled={isWorking || !currentPath} marginRight={16} appearance="primary">
				Save
			</Button>
			<Button onClick={() => writeFile(true)} disabled={isWorking  || currentPath === path} marginRight={16}>
				Save as
			</Button>
		</Pane>
		<Pane>
			<Label htmlFor="textarea-2" marginBottom={4} display="block">
				{currentPath}{originalText !== editor?.getValue() && '*'}
			</Label>
			<Textarea
				id="textarea-2"
				disabled={isWorking}
				rows={42}
			/>
		</Pane>
	</Pane>;
}

export default App;
