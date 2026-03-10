import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BlueprintGrid } from '@/components/BlueprintGrid'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'
import { Redirect } from '@/pages/Redirect'

function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <BlueprintGrid>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/s" element={<Redirect />} />
                <Route path="/s/:shortId" element={<Redirect />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BlueprintGrid>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
