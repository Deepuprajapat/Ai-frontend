# AWS Gemini Monitoring Dashboard

A modern, AI-powered AWS resource monitoring dashboard with real-time metrics, cost estimation, and resource intelligence. Built with FastAPI (Python), React (Material-UI), and Chart.js.

---

## 🚀 Features
- **Multi-resource support:** EC2, S3, RDS, Lambda (extensible)
- **Real-time metrics:** CPU, Network, Disk, etc. (CloudWatch)
- **Cost estimation:** Per-resource and total AWS bill
- **Resource intelligence:** Idle/overutilized detection, AI suggestions
- **Actions:** Terminate/stop instances, optimize recommendations
- **Resource details:** Tags, volumes, ENIs, public IP, etc.
- **Mini charts:** CPU/network/cost trends (1h/6h/1d)
- **Export:** Download metrics as CSV/PDF
- **Modern UI:** Material-UI/Tailwind, Gemini-inspired theme

---

## 🗂️ Project Structure

```
my_project/
│
├── backend/
│   ├── main.py              # FastAPI app, API endpoints
│   ├── aws_monitor.py       # AWS resource & metrics logic (boto3)
│   └── requirements.txt     # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.js           # Main React app
│   │   └── components/
│   │       └── EC2Card.js   # EC2 resource card component
│   ├── package.json         # Frontend dependencies
│   └── ...
│
├── .env                     # AWS credentials (not committed)
└── README.md                # Project documentation
```

---

## ⚡ Quick Start

### 1. **Clone the repo & set up AWS credentials**
- Create a `.env` file in the root:
  ```
  AWS_ACCESS_KEY_ID=your_access_key
  AWS_SECRET_ACCESS_KEY=your_secret_key
  AWS_DEFAULT_REGION=ap-south-1
  ```

### 2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. **Frontend Setup**
```bash
cd frontend
npm install
npm start
```

Or use Docker Compose for both:
```bash
# From project root
cd backend && docker-compose up --build
cd ../frontend && docker-compose up --build
```

---

## 🧠 Extending & Customizing
- Add more AWS resources in `aws_monitor.py`
- Enhance UI in `frontend/src/components/`
- Integrate Gemini/AI APIs for advanced suggestions
- Add Slack/email alerts, scheduling, and more

---

## 📄 License
MIT # Ai-frontend
