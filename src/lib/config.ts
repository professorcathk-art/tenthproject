import { prisma } from './prisma'

export async function getCommissionRate(): Promise<number> {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'COMMISSION_RATE' }
    })
    
    if (config) {
      return parseFloat(config.value)
    }
    
    // Default commission rate if not found
    return 0.085 // 8.5%
  } catch (error) {
    console.error('Error fetching commission rate:', error)
    return 0.085 // Default fallback
  }
}

export async function setCommissionRate(rate: number): Promise<void> {
  try {
    await prisma.systemConfig.upsert({
      where: { key: 'COMMISSION_RATE' },
      update: { value: rate.toString() },
      create: {
        key: 'COMMISSION_RATE',
        value: rate.toString()
      }
    })
  } catch (error) {
    console.error('Error setting commission rate:', error)
    throw error
  }
}
