import type { QuizzWithId } from "@rahoot/common/types/game";
import Button from "@rahoot/web/features/game/components/Button";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  useSocket,
  useEvent,
} from "@rahoot/web/features/game/contexts/socketProvider";
import { useTranslation } from "@rahoot/web/hooks/useTranslation";
import { translateServerMessage } from "@rahoot/web/features/game/utils/translateServerMessage";

type Props = {
  quizzList: QuizzWithId[];
  onSelect: (_id: string) => void;
};

const SelectQuizz = ({ quizzList: initialQuizzList, onSelect }: Props) => {
  const [quizzes, setQuizzes] = useState<QuizzWithId[]>(initialQuizzList);
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuizSubject, setNewQuizSubject] = useState("");
  const [newQuizQuestions, setNewQuizQuestions] = useState<any[]>([]);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [existingQuizData, setExistingQuizData] = useState<any>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { t } = useTranslation();
  const { socket } = useSocket();

  // Gérer les réponses du serveur pour la création de quiz
  useEvent("manager:quizCreated", ({ success, id, error }) => {
    if (success && id) {
      toast.success(t("selectQuiz.quizCreatedSuccess"));
      setShowCreateModal(false);
      setNewQuizSubject("");
      setNewQuizQuestions([]);
      setIsCreating(false);
      setEditingQuizId(null);
      onSelect(id);
    } else {
      toast.error(translateServerMessage(error) || t("selectQuiz.quizCreatedError"));
      setIsCreating(false);
    }
  });

  // Gérer les réponses du serveur pour l'import de quiz
  useEvent("manager:quizImportResult", ({ success, id, error }) => {
    if (success && id) {
      toast.success(t("selectQuiz.quizImportSuccess"));
      setShowImportModal(false);
      setImportJson("");
      setIsImporting(false);
      onSelect(id);
    } else {
      toast.error(translateServerMessage(error) || t("selectQuiz.quizImportError"));
      setIsImporting(false);
    }
  });

  // Gérer les erreurs générales
  useEvent("manager:errorMessage", (message) => {
    toast.error(translateServerMessage(message));
    setIsCreating(false);
    setIsImporting(false);
  });

  // Gérer le cas où un quiz existe déjà
  useEvent("manager:quizExists", ({ exists, id, subject, questions }) => {
    if (exists) {
      setExistingQuizData({ id, subject, questions });
      setShowOverwriteModal(true);
      setIsCreating(false);
    }
  });

  // Gérer la suppression de quiz
  useEvent("manager:quizDeleted", ({ success, error }) => {
    if (success) {
      setQuizzes(quizzes.filter((q) => q.id !== deleteConfirmId));
      if (selected === deleteConfirmId) setSelected(null);
      toast.success(t("selectQuiz.quizDeletedSuccess"));
    } else {
      toast.error(translateServerMessage(error) || t("selectQuiz.quizDeletedError"));
    }
    setDeleteConfirmId(null);
  });

  const handleSelect = (id: string) => () => {
    setSelected(selected === id ? null : id);
  };

  const handleEditQuiz = (quiz: QuizzWithId) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewQuizSubject(quiz.subject);
    setNewQuizQuestions(
      quiz.questions.map((q) => ({
        question: q.question,
        answers: q.answers,
        solution: q.solution,
        cooldown: q.cooldown,
        time: q.time,
        image: q.image || "",
        video: q.video || "",
        audio: q.audio || "",
      })),
    );
    setEditingQuizId(quiz.id);
    setShowCreateModal(true);
  };

  const handleDeleteQuiz = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    socket?.emit("manager:deleteQuiz", deleteConfirmId);
  };

  const handleSubmit = () => {
    if (!selected) {
      toast.error(t("selectQuiz.selectQuiz"));
      return;
    }
    onSelect(selected);
  };

  const handleCreateQuiz = () => {
    if (!newQuizSubject.trim()) {
      toast.error(t("selectQuiz.quizSubjectPlaceholder"));
      return;
    }

    if (newQuizQuestions.length === 0) {
      toast.error(t("selectQuiz.questionPlaceholder"));
      return;
    }

    const validatedQuestions = newQuizQuestions.map((q: any) => ({
      question: q.question?.trim() || "",
      answers: q.answers?.filter((a: string) => a.trim()) || [],
      solution: q.solution ?? 0,
      cooldown: q.cooldown ?? 5,
      time: q.time ?? 15,
      image: q.image || undefined,
      video: q.video || undefined,
      audio: q.audio || undefined,
    }));

    const quizData = {
      subject: newQuizSubject.trim(),
      questions: validatedQuestions,
    };

    if (editingQuizId) {
      socket?.emit("manager:confirmCreateQuiz", {
        ...quizData,
        id: editingQuizId,
      });
    } else {
      socket?.emit("manager:createQuiz", quizData);
    }
    setIsCreating(true);
  };

  const handleOverwriteQuiz = () => {
    if (!existingQuizData) return;

    const validatedQuestions = newQuizQuestions.map((q: any) => ({
      question: q.question?.trim() || "",
      answers: q.answers?.filter((a: string) => a.trim()) || [],
      solution: q.solution ?? 0,
      cooldown: q.cooldown ?? 5,
      time: q.time ?? 15,
      image: q.image || undefined,
      video: q.video || undefined,
      audio: q.audio || undefined,
    }));

    const quizData = {
      subject: newQuizSubject.trim(),
      questions: validatedQuestions,
    };

    socket?.emit("manager:confirmCreateQuiz", quizData);
    setShowOverwriteModal(false);
    setExistingQuizData(null);
    setIsCreating(true);
  };

  const handleImportQuiz = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!parsed.subject || !parsed.questions) {
        toast.error(t("selectQuiz.jsonPlaceholder"));
        return;
      }
      socket?.emit("manager:importQuiz", parsed);
      setIsImporting(true);
    } catch (e) {
      toast.error(t("selectQuiz.jsonPlaceholder"));
    }
  };

  const handleCancelEdit = () => {
    setShowCreateModal(false);
    setNewQuizSubject("");
    setNewQuizQuestions([]);
    setEditingQuizId(null);
  };

  const addQuestion = () => {
    setNewQuizQuestions([
      ...newQuizQuestions,
      {
        question: "",
        answers: ["", "", "", ""],
        solution: 0,
        cooldown: 5,
        time: 15,
        image: "",
        video: "",
        audio: "",
      },
    ]);
  };

  const removeQuestion = (idx: number) => {
    setNewQuizQuestions(newQuizQuestions.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const updated = [...newQuizQuestions];
    updated[idx][field] = value;
    setNewQuizQuestions(updated);
  };

  const addAnswer = (qIdx: number) => {
    const updated = [...newQuizQuestions];
    updated[qIdx].answers.push("");
    setNewQuizQuestions(updated);
  };

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const updated = [...newQuizQuestions];
    updated[qIdx].answers = updated[qIdx].answers.filter(
      (_: string, i: number) => i !== aIdx,
    );
    if (updated[qIdx].solution >= updated[qIdx].answers.length) {
      updated[qIdx].solution = Math.max(0, updated[qIdx].answers.length - 1);
    }
    setNewQuizQuestions(updated);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4">
          {t("selectQuiz.title")}
        </h2>
        <div className="space-y-2">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={clsx(
                "p-3 rounded-md cursor-pointer border-2 transition-all",
                selected === quiz.id
                  ? "border-primary bg-primary/20 shadow-lg scale-[1.02]"
                  : "border-gray-300 bg-white hover:border-primary hover:bg-primary/10",
              )}
              onClick={handleSelect(quiz.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{quiz.subject}</p>
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} {t("selectQuiz.questionsCount")}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <Button
                    onClick={handleEditQuiz(quiz)}
                    variant="secondary"
                    size="sm"
                  >
                    {t("selectQuiz.editQuiz")}
                  </Button>
                  <button
                    onClick={handleDeleteQuiz(quiz.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors px-2 py-1 text-lg"
                    title={t("selectQuiz.deleteQuiz")}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}

          {quizzes.length === 0 && (
            <p className="text-center text-white/60 py-4 italic">
              {t("selectQuiz.noQuizzes")}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex-1"
          variant="outline"
        >
          {t("selectQuiz.createQuiz")}
        </Button>
        <Button
          onClick={() => setShowImportModal(true)}
          className="flex-1"
          variant="outline"
        >
          {t("selectQuiz.importQuiz")}
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        className={clsx(
          "w-full mt-4 text-lg py-3 transition-all",
          selected
            ? ""
            : "opacity-50 cursor-not-allowed",
        )}
        disabled={!selected}
      >
        {selected ? `▶ ${t("game.startGame")}` : t("selectQuiz.selectQuiz")}
      </Button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingQuizId
                ? t("selectQuiz.editingQuiz")
                : t("selectQuiz.createQuiz")}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("selectQuiz.quizSubject")}
              </label>
              <input
                type="text"
                value={newQuizSubject}
                onChange={(e) => setNewQuizSubject(e.target.value)}
                placeholder={t("selectQuiz.quizSubjectPlaceholder")}
                className="w-full rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("selectQuiz.questions")}
              </label>
              <div className="space-y-4">
                {newQuizQuestions.map((q: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(idx, "question", e.target.value)
                        }
                        placeholder={t("selectQuiz.questionPlaceholder")}
                        className="flex-1 rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
                      />
                      <Button
                        type="button"
                        onClick={() => removeQuestion(idx)}
                        variant="secondary"
                        size="sm"
                      >
                        {t("common.remove")}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600">
                        {t("selectQuiz.answers")}
                      </label>
                      {q.answers?.map((answer: string, ansIdx: number) => (
                        <div key={ansIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${idx}`}
                            checked={q.solution === ansIdx}
                            onChange={() =>
                              updateQuestion(idx, "solution", ansIdx)
                            }
                            className="text-primary focus:ring-primary"
                          />
                          <input
                            type="text"
                            value={answer}
                            onChange={(e) => {
                              const updated = [...newQuizQuestions];
                              updated[idx].answers[ansIdx] = e.target.value;
                              setNewQuizQuestions(updated);
                            }}
                            placeholder={`${t("selectQuiz.answer")} ${ansIdx + 1}`}
                            className="flex-1 rounded-md border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                          />
                          {q.answers.length > 2 && (
                            <Button
                              type="button"
                              onClick={() => removeAnswer(idx, ansIdx)}
                              variant="secondary"
                              size="sm"
                            >
                              {t("common.remove")}
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() => addAnswer(idx)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-1"
                      >
                        {t("selectQuiz.addAnswer")}
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("selectQuiz.cooldown")}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={q.cooldown}
                          onChange={(e) =>
                            updateQuestion(
                              idx,
                              "cooldown",
                              parseInt(e.target.value) || 5,
                            )
                          }
                          className="w-full rounded-md border border-gray-300 p-1 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("selectQuiz.time")}
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          value={q.time}
                          onChange={(e) =>
                            updateQuestion(
                              idx,
                              "time",
                              parseInt(e.target.value) || 15,
                            )
                          }
                          className="w-full rounded-md border border-gray-300 p-1 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("selectQuiz.solution")}
                        </label>
                        <div className="text-sm text-gray-700 p-1 bg-gray-100 rounded text-center">
                          {q.solution + 1}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <label className="text-xs font-medium text-gray-600">
                        {t("selectQuiz.media")}
                      </label>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t("selectQuiz.imageUrl")}
                        </label>
                        <input
                          type="text"
                          value={q.image || ""}
                          onChange={(e) =>
                            updateQuestion(
                              idx,
                              "image",
                              e.target.value || undefined,
                            )
                          }
                          placeholder={t("selectQuiz.imageUrlPlaceholder")}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t("selectQuiz.videoUrl")}
                        </label>
                        <input
                          type="text"
                          value={q.video || ""}
                          onChange={(e) =>
                            updateQuestion(
                              idx,
                              "video",
                              e.target.value || undefined,
                            )
                          }
                          placeholder={t("selectQuiz.videoUrlPlaceholder")}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {t("selectQuiz.audioUrl")}
                        </label>
                        <input
                          type="text"
                          value={q.audio || ""}
                          onChange={(e) =>
                            updateQuestion(
                              idx,
                              "audio",
                              e.target.value || undefined,
                            )
                          }
                          placeholder={t("selectQuiz.audioUrlPlaceholder")}
                          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  onClick={addQuestion}
                  variant="outline"
                  className="w-full"
                >
                  {t("selectQuiz.addQuestion")}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleCreateQuiz}
                className="flex-1"
                disabled={isCreating}
              >
                {isCreating ? t("selectQuiz.creating") : t("selectQuiz.create")}
              </Button>
              <Button
                onClick={handleCancelEdit}
                variant="secondary"
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {t("selectQuiz.importQuiz")}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("selectQuiz.jsonFormat")}
              </label>
              <textarea
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder={t("selectQuiz.jsonPlaceholder")}
                rows={10}
                className="w-full rounded-md border border-gray-300 p-2 font-mono text-sm focus:border-primary focus:outline-none"
                disabled={isImporting}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleImportQuiz}
                className="flex-1"
                disabled={isImporting}
              >
                {isImporting
                  ? t("selectQuiz.importing")
                  : t("selectQuiz.import")}
              </Button>
              <Button
                onClick={() => {
                  setShowImportModal(false);
                  setImportJson("");
                }}
                variant="secondary"
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showOverwriteModal && existingQuizData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {t("selectQuiz.quizExists")}
            </h3>
            <p className="mb-4 text-gray-700">
              {t("selectQuiz.quizExistsMessage", {
                subject: existingQuizData.subject,
              })}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleOverwriteQuiz}
                className="flex-1"
                variant="primary"
              >
                {t("selectQuiz.overwrite")}
              </Button>
              <Button
                onClick={() => {
                  setShowOverwriteModal(false);
                  setExistingQuizData(null);
                }}
                variant="secondary"
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4 shadow-xl">
            <p className="text-lg font-bold text-gray-800 mb-2">
              {t("selectQuiz.confirmDelete")}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {quizzes.find((q) => q.id === deleteConfirmId)?.subject}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                {t("common.remove")}
              </Button>
              <Button
                onClick={() => setDeleteConfirmId(null)}
                variant="secondary"
                className="flex-1"
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectQuizz;
