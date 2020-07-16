/* eslint-disable no-undef */
import StartPage from '../PageObjects/StartPage'
import LoginPage from '../PageObjects/LoginPage'
import HomePage from '../PageObjects/HomePage'
import SendMoneyPage from '../PageObjects/SendMoneyPage'

describe('Test case 7: Ability to send money', () => {
  it('User is able to send money', () => {
    localStorage.clear()
    cy.readFile('../GoodDAPP/cypress/fixtures/userMnemonicSave.txt').then(mnemonic => {
      StartPage.open()
      StartPage.signInButton.click()
      LoginPage.recoverFromPassPhraseLink.click()
      LoginPage.pageHeader.should('contain', 'Recover')
      LoginPage.mnemonicsInput.type(mnemonic)
      LoginPage.recoverWalletButton.click()
      LoginPage.yayButton.click()
      HomePage.claimButton.click().invoke('text').then(text => {
        cy.log(text)
        if (text == 'Queue') {
          const urlRequest = Cypress.env('REACT_APP_SERVER_URL')
          const bodyPass = Cypress.env('CYPRESS_GUNDB_PASSWORD')
          cy.request('POST', urlRequest + '/admin/queue', [{ password: bodyPass, allow: 1 }])
        }

      SendMoneyPage.dailyClaimText.should('be.visible')
      SendMoneyPage.claimButton.click()
      SendMoneyPage.verifyButton.should('be.visible')
      SendMoneyPage.verifyButton.click()

      // face verification
      // cy.wait(5000)
      // SendMoneyPage.readyButton.should('be.visible')
      // SendMoneyPage.readyButton.click()

      LoginPage.yayButton.click()
      cy.contains('G$').should('be.visible')

      HomePage.sendButton.click()
      SendMoneyPage.nameInput.type('another person')
      SendMoneyPage.nextButton.click()
      SendMoneyPage.moneyInput.type('0.01')
      SendMoneyPage.nextButton.click()
      SendMoneyPage.messageInput.type('test message')
      SendMoneyPage.nextButton.click()
      SendMoneyPage.confirmButton.click()
      SendMoneyPage.copyLinkButton.click()
      SendMoneyPage.doneButton.should('be.visible')

      //get link from clipboard
      // cy.task('getClipboard').then(sendMoneyUrl => {

      cy.get('[data-testid*="http"]')
        .invoke('attr', 'data-testid')
        .then(sendMoneyUrl => {
          cy.log(sendMoneyUrl)
          const moneyLink = sendMoneyUrl
          const pattern = /(?:http[s]?:\/\/)[^\s[",><]*/gim
          const validMoneyLnk = moneyLink.match(pattern)
          cy.log(validMoneyLnk)
          SendMoneyPage.doneButton.click()
          cy.clearLocalStorage()
          cy.clearCookies()
          StartPage.open()
          StartPage.signInButton.click()
          LoginPage.recoverFromPassPhraseLink.click()
          LoginPage.pageHeader.should('contain', 'Recover')
          LoginPage.mnemonicsInput.type(Cypress.env('additionalAccountMnemonics'))
          LoginPage.recoverWalletButton.click()
          LoginPage.yayButton.click()
          HomePage.claimButton.should('be.visible')
          HomePage.moneyAmountDiv.invoke('text').then(moneyBefore => {
            cy.log('Money before sending: ' + moneyBefore)
            cy.visit(validMoneyLnk.toString())

            //wait for blockchain payment
            cy.contains('Claim').should('be.visible')
            HomePage.moneyAmountDiv.invoke('text').should('eq', (Number(moneyBefore) + 0.01).toFixed(2))
            SendMoneyPage.yayButton.click()
          })
        })
    })
  })
})
