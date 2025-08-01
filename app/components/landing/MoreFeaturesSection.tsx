import { Download, Settings } from 'lucide-react'
import React from 'react'

function MoreFeaturesSection() {
    return (
        <section className='py-10 bg-black'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='text-center mb-12'>
                    <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
                        Plus{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600  bg-clip-text text-transparent">
                            More Features
                        </span>
                    </h2>
                    <p className="text-lg bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(156,163,175,0.3)]">
                        Everything you need for complete meeting management
                    </p>
                </div>
                <div className='grid md:grid-cols-3 gap-8'>
                    <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 hover:border-gray-700 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-blue-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-white mb-2'>
                            Complete Meeting Exports
                        </h3>
                        <p className='text-gray-400'>
                            Download audio MP3, transcripts, summaries, and action items.
                        </p>
                    </div>
                    <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 hover:border-gray-700 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Settings className='w-6 h-6 text-blue-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-white mb-2'>
                            Full Customization
                        </h3>
                        <p className='text-gray-400'>
                            Customize bot name, image and toggle bot participation
                        </p>
                    </div>
                    <div className='bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gray-900/70 hover:border-gray-700 transition-all'>
                        <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4'>
                            <Download className='w-6 h-6 text-blue-400' />
                        </div>
                        <h3 className='text-xl font-semibold text-white mb-2'>
                            Meeting Analytics
                        </h3>
                        <p className='text-gray-400'>
                            Track meeting patterns, participation rates, and productivity.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default MoreFeaturesSection
