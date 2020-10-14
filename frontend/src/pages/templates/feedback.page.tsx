import React, {useState} from "react";
import {Button, Input, message} from "antd";
import './feedback.styles.less'
import {contactSupport} from "../../apis/systemApis";

type FeedbackProps = {
    forumId: number;
    hideShowFeedbackCard: Function;
};

const Feedback: React.FC<FeedbackProps> = (
    {
        forumId,
        hideShowFeedbackCard
    }
) => {

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const reset = () => {
        setTitle("");
        setContent("");
    }

    const handleFeedback = (title: String, content: String) => {
        if (!title) {
            message.error("Missing Title");
            return;
        }
        if (!content) {
            message.error("Missing Content");
            return;
        }

        contactSupport(forumId, title, content).then((res) => {
            window.location.href = res.headers.get('Location')!;
        });
        hideShowFeedbackCard();
    };

    return (<div>
        Title <Input value={title} onChange={(e) => setTitle(e.target.value)}/>
        Content <Input.TextArea value={content} onChange={(e) => setContent(e.target.value)}/>
        <div className="feedback-btn">
            <Button type="primary" htmlType="button" onClick={() => handleFeedback(title, content)}>
                Submit
            </Button>
            <Button htmlType="button" onClick={reset}>
                Reset
            </Button></div>
    </div>)
};

export default Feedback;