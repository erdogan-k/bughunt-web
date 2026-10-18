import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { resetProgress } from './utils/storage';

describe('BugHunt Web Application Flow', () => {
  beforeEach(() => {
    resetProgress();
  });

  it('renders dashboard with level, XP, badges, and challenges', () => {
    render(<App />);
    expect(screen.getByText(/JavaScript Hatalarını Avla/i)).toBeInTheDocument();
    expect(screen.getByText(/SEVİYE 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Dizi Toplamında Sınır Hatası/i)).toBeInTheDocument();
  });

  it('filters challenges by difficulty and category', () => {
    render(<App />);

    // Filter by 'Kolay'
    fireEvent.click(screen.getByRole('button', { name: 'Kolay' }));
    expect(screen.getByText(/Dizi Toplamında Sınır Hatası/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Referans Kopyalama Tuzağı/i)
    ).not.toBeInTheDocument();

    // Reset difficulty to 'Tümü'
    fireEvent.click(screen.getAllByRole('button', { name: 'Tümü' })[0]);
    expect(screen.getByText(/Referans Kopyalama Tuzağı/i)).toBeInTheDocument();
  });

  it('opens a challenge, shows hint, reveals explanation, runs tests, and awards XP on fix', async () => {
    render(<App />);

    // Open the first challenge
    const startButtons = screen.getAllByRole('button', {
      name: /Hata Ayıklamaya Başla/i,
    });
    fireEvent.click(startButtons[0]);

    // Check workspace elements
    expect(
      screen.getByText(/Hata Raporu & Görev Açıklaması/i)
    ).toBeInTheDocument();

    // Toggle hint
    fireEvent.click(screen.getByRole('button', { name: /İpucu Göster/i }));
    expect(screen.getByText(/İpucu:/i)).toBeInTheDocument();

    // Run with buggy code first -> should fail
    fireEvent.click(screen.getByRole('button', { name: /Testleri Çalıştır/i }));
    await waitFor(() => {
      expect(
        screen.getByText(/BAZI TESTLER BAŞARISIZ OLDU/i)
      ).toBeInTheDocument();
    });

    // Reveal solution & educational explanation
    fireEvent.click(
      screen.getByRole('button', {
        name: /Çözümü ve Öğretici Açıklamayı Göster/i,
      })
    );
    expect(
      screen.getByText(/Öğretici Açıklama & Kök Neden Analizi/i)
    ).toBeInTheDocument();

    // Load solution into editor and run tests -> should pass and award XP
    fireEvent.click(
      screen.getByRole('button', { name: /Çözüm Kodunu Editöre Yükle/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /Testleri Çalıştır/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/TEBRİKLER! TÜM TESTLER BAŞARIYLA GEÇTİ!/i)
      ).toBeInTheDocument();
    });
  });
});
