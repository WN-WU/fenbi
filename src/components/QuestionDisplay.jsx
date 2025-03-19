import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Radio, Space, Progress, message } from 'antd';

const { Title, Paragraph } = Typography;

const QuestionDisplay = ({ question }) => {
  const [phase, setPhase] = useState('reading'); // reading or answering
  const [timeLeft, setTimeLeft] = useState(40); // 初始阅读时间40秒
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (phase === 'reading') {
              setPhase('answering');
              return 15; // 切换到答题阶段，设置15秒
            } else {
              handleSubmit();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, phase]);

  const handleSubmit = () => {
    if (!submitted) {
      setSubmitted(true);
      message.success('答题完成！');
      // 这里可以添加提交答案到后端的逻辑
    }
  };

  const options = ['A', 'B', 'C', 'D'].map(option => ({
    label: option,
    value: option
  }));

  return (
    <Card style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4}>{phase === 'reading' ? '阅读阶段' : '答题阶段'}</Title>
          <div style={{ width: 200 }}>
            <Progress
              percent={(timeLeft / (phase === 'reading' ? 40 : 15)) * 100}
              format={() => `${timeLeft}秒`}
              status={timeLeft <= 5 ? 'exception' : 'active'}
            />
          </div>
        </div>

        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
          {question.content}
        </Paragraph>

        {phase === 'answering' && (
          <div>
            <Title level={5}>请选择正确答案：</Title>
            <Radio.Group
              onChange={e => setAnswer(e.target.value)}
              value={answer}
              disabled={submitted}
            >
              <Space direction="vertical">
                {options.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>

            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!answer || submitted}
              style={{ marginTop: '20px' }}
            >
              提交答案
            </Button>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default QuestionDisplay;