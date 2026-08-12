import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiTarget } from "react-icons/fi";
import { formatRupiah } from "../../utils/formatters";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import "./Goals.css";

const DB_GOALS = "finance_goals";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
  });

  // Ambil data dari Local Storage saat komponen dimuat
  useEffect(() => {
    const savedGoals = localStorage.getItem(DB_GOALS);
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Simpan data ke Local Storage setiap kali state goals berubah
  useEffect(() => {
    localStorage.setItem(DB_GOALS, JSON.stringify(goals));
  }, [goals]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;

    const newGoal = {
      id: uuidv4(),
      name: formData.name,
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount) || 0,
    };

    setGoals([...goals, newGoal]);
    setFormData({ name: "", targetAmount: "", currentAmount: "" });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus target keuangan ini?")) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  const handleUpdateProgress = (id, amountToAdd) => {
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          const newCurrent = g.currentAmount + amountToAdd;
          return {
            ...g,
            currentAmount:
              newCurrent > g.targetAmount ? g.targetAmount : newCurrent,
          };
        }
        return g;
      }),
    );
  };

  return (
    <motion.div
      className="goals-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="goals-header">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>
            Target Keuangan
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Tetapkan dan pantau impian finansial Anda.
          </p>
        </div>
        <Button icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>
          Buat Target Baru
        </Button>
      </div>

      {goals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            backgroundColor: "var(--bg-card)",
            borderRadius: "12px",
          }}
        >
          <FiTarget
            style={{
              fontSize: "48px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          />
          <h3>Belum Ada Target</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Mulai buat target tabungan Anda sekarang.
          </p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const progressPercent = progress > 100 ? 100 : progress;

            return (
              <div className="goal-card" key={goal.id}>
                <button
                  onClick={() => handleDelete(goal.id)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FiTrash2 />
                </button>
                <div className="goal-info">
                  <h3>{goal.name}</h3>
                  <p>Target: {formatRupiah(goal.targetAmount)}</p>
                </div>

                <div>
                  <div className="goal-progress-info">
                    <span>Terkumpul: {formatRupiah(goal.currentAmount)}</span>
                    <span style={{ color: "var(--color-primary)" }}>
                      {progressPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="progress-bar-bg">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="goal-actions">
                  <input
                    type="number"
                    min="1"
                    placeholder="Nominal dana"
                    className="form-control"
                    id={`amount-${goal.id}`}
                  />

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(
                        `amount-${goal.id}`,
                      );
                      const amount = Number(input.value);

                      if (!amount || amount <= 0) {
                        alert("Masukkan nominal yang valid.");
                        return;
                      }

                      handleUpdateProgress(goal.id, amount);
                      input.value = "";
                    }}
                  >
                    Tambah Dana
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Tambah Target */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Target Keuangan Baru"
      >
        <form
          onSubmit={handleAddGoal}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div className="form-group">
            <label>Nama Target (Misal: Dana Darurat)</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Jumlah Target (Rp)</label>
            <input
              type="number"
              name="targetAmount"
              className="form-control"
              value={formData.targetAmount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Saldo Awal (Opsional)</label>
            <input
              type="number"
              name="currentAmount"
              className="form-control"
              value={formData.currentAmount}
              onChange={handleChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Target
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Goals;
