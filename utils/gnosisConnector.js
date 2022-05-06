import { Web3Provider } from "@ethersproject/providers"
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider"
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk"
import { getAddress } from "ethers/lib/utils"
import { Connector, ConnectorNotFoundError, normalizeChainId } from "wagmi"

const __IS_SERVER__ = typeof window === "undefined"

export class GnosisConnector extends Connector {
  id = "gnosis"
  name = "Gnosis"
  ready = !__IS_SERVER__

  provider
  sdk
  safe

  constructor(config) {
    super({ ...config, options: config?.options })
    // Auto connect on safe environment
    if (config.options?.doNotAutoConnect) {
      return
    }
    this.connect().catch(error => {
      console.error(error)
    })
  }

  async connect() {
    const runningAsSafeApp = await this.isSafeApp()

    if (!runningAsSafeApp) {
      throw new Error("You're not running in a Gnosis Safe APP")
    }

    const provider = await this.getProvider()

    if (provider.on) {
      provider.on("accountsChanged", this.onAccountsChanged)
      provider.on("chainChanged", this.onChainChanged)
      provider.on("disconnect", this.onDisconnect)
    }

    const account = await this.getAccount()
    const id = await this.getChainId()

    return {
      account,
      provider,
      chain: { id, unsupported: !runningAsSafeApp },
    }
  }

  async disconnect() {
    const provider = this.getProvider()
    if (!provider?.removeListener) return

    provider.removeListener("accountsChanged", this.onAccountsChanged)
    provider.removeListener("chainChanged", this.onChainChanged)
    provider.removeListener("disconnect", this.onDisconnect)
  }

  async getAccount() {
    if (!this.safe) {
      throw new ConnectorNotFoundError()
    }

    return getAddress(this.safe.safeAddress)
  }

  async getChainId() {
    if (!this.provider) {
      throw new ConnectorNotFoundError()
    }

    return normalizeChainId(this.provider.chainId)
  }

  async getSafeInfo() {
    if (!this.sdk) {
      throw new ConnectorNotFoundError()
    }
    if (!this.safe) {
      this.safe = await this.sdk.safe.getInfo()
    }
    return this.safe
  }

  async isSafeApp(config) {
    if (__IS_SERVER__) {
      return false
    }
    // check if we're in an iframe
    if (window?.parent === window) {
      return false
    }
    try {
      if (!this.sdk) {
        this.sdk = new SafeAppsSDK(config)
      }
      const safe = await Promise.race([this.getSafeInfo(), new Promise(resolve => setTimeout(resolve, 300))])
      return !!safe
    } catch (error) {
      return false
    }
  }

  getProvider() {
    if (!this.provider) {
      const safe = this.safe
      if (!safe || !this.sdk) {
        throw new Error("Could not load Safe information")
      }
      this.provider = new SafeAppProvider(safe, this.sdk)
    }
    return this.provider
  }

  async getSigner() {
    const provider = this.getProvider()
    const account = await this.getAccount()
    return new Web3Provider(provider).getSigner(account)
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  onAccountsChanged(accounts) {
    if (accounts.length === 0) this.emit("disconnect")
    else this.emit("change", { account: getAddress(accounts[0]) })
  }

  isChainUnsupported(chainId) {
    return !this.chains.some(x => x.id === chainId)
  }

  onChainChanged(chainId) {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit("change", { chain: { id, unsupported } })
  }

  onDisconnect() {
    this.emit("disconnect")
  }
}
