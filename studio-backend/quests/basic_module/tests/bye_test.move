#[test_only]
module hello_blockchain::bye_tests {

    use hello_blockchain::message;

    #[test]
    public fun test_bye() {
        let msg = message::bye();
        assert!(msg == 2, 78);
    }
}