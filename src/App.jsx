import React, { useState } from 'react';
import { Layout } from 'antd';
import FileUpload from './components/FileUpload';
import QuestionDisplay from './components/QuestionDisplay';

const { Content } = Layout;

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const handleUploadSuccess = (question) => {
    setCurrentQuestion(question);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '50px 20px' }}>
        {!currentQuestion ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <QuestionDisplay question={currentQuestion} />
        )}
      </Content>
    </Layout>
  );
};

export default App;