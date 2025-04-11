import MDEditor from '@uiw/react-md-editor'

const DescriptionTab = ({ description }) => (
  <div style={{ padding: '20px' }}>
    <MDEditor.Markdown source={description} style={{ whiteSpace: 'pre-wrap' }} />
  </div>
)

export default DescriptionTab
